import express from "express";
import sbd from "../db/sqlConn.js";
import mdb from "../db/mongoConn.js";
import { ObjectId } from "mongodb";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authenticateToken from "../authenticateToken.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

process.on('uncaughtException', function (err) {
  console.log(err);
});

// HELPER FUNCTIONS
  /**
   * Gets a user's email from their username
   * @ignore
   * @param {*} username The user's username
   * @returns A string containing the user's email or null if they didn't exist
   */
  async function getEmail (username) {
    const emailResult = await sbd.query(`SELECT Email
                                          FROM UserAccount 
                                          WHERE Username = $1
                                          LIMIT 1`, [username]);
    if (emailResult.rows.length === 0) return null
    return emailResult.rows[0].email
  }

  /**
   * Gets the data for a piece of content by its ID
   * @ignore
   * @param {*} ContentID The ID of the piece of content stored in MongoDB
   * @param {*} proj The attributes to project out from MongoDB
   * @returns An object containing the content's data or -1 if the content didn't exist
   */
  async function getContent (ContentID, proj){
    let collection = mdb.collection('Content');

    // Content content data from mongodb
    let query = {'_id': new ObjectId(ContentID)};
    let contentResult = await collection.findOne(query, proj);
    if (!contentResult) return -1;

    // Get average rating
    const avgRatingResult = await sbd.query(`SELECT avg
                                              FROM averagerating
                                              WHERE contentid = $1`, [ContentID]);
    if (avgRatingResult.rows.length === 0) {
      contentResult.avgRat = 0.5
    }
    else {
      contentResult.avgRat = avgRatingResult.rows[0].avg
    }

    // Get username
    const usernameResult = await sbd.query(`SELECT username
                                              FROM useraccount
                                              WHERE email = $1`, [contentResult.AuthorEmail]);
    if (usernameResult.rows.length === 0) {return -1;}
    contentResult.username = usernameResult.rows[0].username;
    delete contentResult.AuthorEmail;

    return contentResult;
  };

//MONGO
  /**
   * Retrieves the data for the ContentDetails component on the frontend
   * @route {GET} /api/contentDetails/:ContentID
   * @routeparam {String} :ContentID The unique ID of a piece of uploaded content
   * @returns An object containing the content details or a string with an error message
   */
  router.get('/contentDetails/:ContentID', async (req, res) => { 
    let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    res.status(200).send(result);
  });

  /**
   * Retrieves the data for the ContentCard component on the frontend
   * @route {GET} /api/contentCard/:ContentID
   * @routeparam {String} :ContentID The unique ID of a piece of uploaded content
   * @returns An object containing the content details or a string with an error message
   */
  router.get('/contentCard/:ContentID', async (req, res) => {
    let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0, Description:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    else res.status(200).send(result);
  });

  /**
   * Uploads a new piece of content to MongoDB
   * @route {POST} /api/contentUpload
   * @authentication The user's login token from their localstorage
   * @headerparam {String} Content-Type The type of data contained in the body. Should be application/json
   * @headerparam {String} Authorization The local token that proves the user is signed in
   * @bodyparam {String} AuthorEmail The email of the content's creator
   * @bodyparam {String} ContentType The type of content being uploaded. Only "map" is supported right now
   * @bodyparam {String} Title The title of the content
   * @bodyparam {String} Description The description of the content
   * @bodyparam {Array.<String>} Tags An array of tags that can be used to find this content in the browser
   * @bodyparam {String} FileData A base64 representation of the uploaded file
   * @bodyparam {String} ThumbnailData A base64 representation of the thumbnail photo
   * @returns A string containing the ID of the uploaded content or an error if something went wrong
   * @todo Ideally, this should probably use formdata or a dedicated service for uploading files
   * @todo It also needs better error handling so the document is removed if a problem occurs or if body params are gone
   */
  router.post('/contentUpload', authenticateToken, async (req, res) => { 
    //get JSON doc
    let doc = req.body;
    // Add remaining data
    doc.CreationDate = new Date()
    doc.UpdatedDate = doc.CreationDate;
    doc.Downloads = 0;
    doc.Tags = doc.Tags ?? []
    const fileData = doc.FileData;
    delete doc.FileData;
    const thumbnailData = doc.ThumbnailData;
    delete doc.ThumbnailData;

    // Upload document
    let criticalError = false
    let collection = mdb.collection('Content');
    let result = await collection.insertOne(doc);
    if(!result) {
      error = true
      res.status(404).send('Upload Error');
      return
    }

    if (criticalError) return
    
    // Upload filedata
    const fileDataPath = path.join(__dirname, "..", 'media', 'contentData', `${result.insertedId}.slf`)
    const fileDataBuffer = Buffer.from(fileData, 'base64')
    fs.writeFile(fileDataPath, fileDataBuffer, (err)=>{
      if (err) {
        criticalError = true
        console.error("Error saving file:", err)
        res.status(500).json('Error saving file')
        collection.deleteOne ({"_id": result.insertedId})
      }
    });

    if (criticalError) return

    // Upload thumbnail
    const thumbnailDataPath = path.join(__dirname, "..", 'media', 'thumbnails', `${result.insertedId}.png`)
    const thumbnailDataBuffer = Buffer.from(thumbnailData, 'base64')
    fs.writeFile(thumbnailDataPath, thumbnailDataBuffer, (err)=>{
      if (err) {
        criticalError = true
        console.error("Error saving thumbnail:", err)
        res.status(500).json('Error saving thumbnail')
        collection.deleteOne ({"_id": result.insertedId})
      }
    });

    if (criticalError) return

    res.status(201).send(result.insertedId);
  });

  /**
   * Returns a page of content IDs for a given search
   * @route {GET} /api/browseContent?page={page}&count={count}&sortBy={sortBy}&tags={tags}&searchString={searchString}
   * @queryparam {number} page The page that the data is being fetched for. Offsets the result from the database
   * @queryparam {number} count The number of IDs to fetch from the database, aka, the number of items per page
   * @queryparam {String} sortBy Determines how the resulting items will be sorted. Options include "Downloads" and "UpdatedDate"
   * @queryparam {String} tags A series of comma-separated tags that will narrow the search
   * @queryparam {String} searchString A series of terms that will be used in a full-text search on content titles and descriptions
   * @returns An array of content IDs or a string containing an error message
   */
  router.get('/browseContent', async (req, res) => {
    const { page = 1, count = 20, sortBy = 'Downloads', tags, searchString } = req.query;

    let offset = count * (page - 1);
    if (offset < 0) {
        res.status(400).send('Invalid query parameters');
        return;
    }

    // Add sorting logic
    let contentQuery = {};
    let sortCriteria = {}
    if (sortBy === 'Downloads' || sortBy === 'UpdatedDate') {
      sortCriteria[sortBy] = -1; // 1 for ascending order, -1 for descending
    } else {
      sortCriteria.Downloads = 1
    }

    // Add tags filter
    if (tags) {
        const tagArray = tags.split(',').map((tag)=>{
          return new RegExp(`^${tag}$`, 'i')
        });
        contentQuery.Tags = { $in: tagArray };
    }

    // Add search string filter
    if (searchString && searchString.trim() !== '') {
      contentQuery.$text = { $search: searchString.replace(/\+/g, ' ') };
    }

    try {
        const collection = mdb.collection('Content');
        const documents = await collection.find(contentQuery)
            .sort(sortCriteria)
            .skip(offset)
            .limit(parseInt(count))
            .project({ _id: 1 })
            .toArray();

        const contentIDs = documents.map(doc => doc._id);
        res.json(contentIDs)
    } catch (error) {
        console.error('Error fetching content IDs:', error);
        res.status(500).send('Internal Server Error');
    }
  });

  /**
   * Counts the total number of items that fit a certain search filter
   * @route {GET} /api/countContent?&tags={tags}&searchString={searchString}
   * @queryparam {String} tags A series of comma-separated tags that will narrow the search
   * @queryparam {String} searchString A series of terms that will be used in a full-text search on content titles and descriptions
   * @returns An object containing the number of items at key count or a string containing an error message
   */
  router.get('/countContent', async (req, res) => {
    const {tags, searchString } = req.query;
  
    let contentQuery = {};
  
    // Add tags filter
    if (tags) {
        const tagArray = tags.split(',').map((tag)=>{
          return new RegExp(`^${tag}$`, 'i')
        });
        contentQuery.Tags = { $in: tagArray };
    }
  
    // Add search string filter
    if (searchString && searchString.trim() !== '') {
      contentQuery.$text = { $search: searchString.replace(/\+/g, ' ') };
    }
  
    try {
        const collection = mdb.collection('Content');
        const count = await collection.countDocuments(contentQuery)
        res.json({count: count})
    } catch (error) {
        console.error('Error fetching content IDs:', error);
        res.status(500).send('Internal Server Error');
    }
  });

  /**
   * Counts the pieces of content uploaded by a certain user
   * @route {GET} /api/countProfileContent/:Username
   * @routeparam {String} :Username The user's username
   * @returns An object containing the number of items at key count or a string containing an error message
   */
  router.get('/countProfileContent/:Username', async (req, res) => {
    const username = req.params.Username;

    // Get email
    const email = await getEmail (username)
    if (!email) return res.status(404).send('User not found');

    const collection = mdb.collection('Content');
    const count = await collection.countDocuments({AuthorEmail: email})
    if (count === undefined || count === null) return res.status(404).send('User not found');

    res.status(200).send({count: count})
  })


//SQL
    //USER
  /**
   * Retrieves the data for the ProfileCard component on the frontend
   * @route {GET} /api/fullprofile/:Username
   * @routeparam {String} :Username The user's username
   * @returns An object containing the profile data or a string containing an error message
   */
  router.get('/fullprofile/:Username', async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query(`SELECT Email, Username, AccountType, CreationDate, AccountStatus, Bio 
                                    FROM UserAccount 
                                    WHERE Username = $1`, [username]);
    if (result.rows.length === 0) res.status(404).send('Not found');
    else res.status(200).send(result.rows[0]);
  });

  /**
   * Gets the user's email from their username. A temporary solution
   * @route {GET} /api/getEmail/:Username
   * @routeparam {String} :Username The user's username
   * @returns An object containing the email at key email or a string containing an error message
   */
  router.get('/getEmail/:Username', authenticateToken, async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query(`SELECT Email
                                    FROM UserAccount 
                                    WHERE Username = $1`, [username]);
    if (result.rows.length === 0) res.status(404).send('Not found');
    else res.status(200).send(result.rows[0]);
  });

  /**
   * Posts a rating for a piece of content from a certain user
   * @route {POST} /api/rate/:ContentID
   * @authentication The user's login token from their localstorage
   * @headerparam {String} Content-Type The type of data contained in the body. Should be application/json
   * @headerparam {String} Authorization The local token that proves the user is signed in
   * @routeparam {String} :ContentID The ID of a piece of content
   * @bodyparam {String} username The username of the person leaving the rating
   * @bodyparam {Boolean} rating True if the rating is positive or false if the rating is negative
   * @returns The inserted row into the database or a string containing an error message
   * @todo Give a proper message instead of returning the DB row
   * @todo Properly check if the body params are fulfilled
   */
  router.post('/rate/:ContentID', authenticateToken, async (req, res) => {
    try {
      const contentID = req.params.ContentID
      const doc = req.body;
      const username = doc.username
      const rating = doc.rating
      const email = await getEmail (username)
      if (!email || !username) return res.status(404).send('User not found');

      // Attempt to enter rating
      const result = await sbd.query(`INSERT INTO Rating (UserEmail, ContentID, RatingType) VALUES ($1, $2, $3) RETURNING *`,[email, contentID, rating]);
      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error in /rate/:ContentID', error);
      res.status(500).send('Server error');
    }
  })

  /**
   * Posts a new comment of a piece of content
   * @route {POST} /api/newComment/:ContentID
   * @authentication The user's login token from their localstorage
   * @headerparam {String} Content-Type The type of data contained in the body. Should be application/json
   * @headerparam {String} Authorization The local token that proves the user is signed in
   * @routeparam {String} :ContentID The ID of a piece of content
   * @bodyparam {String} username The username of the person leaving the rating
   * @bodyparam {String} text The text content of the comment
   * @returns The inserted row into the database or a string containing an error message
   * @todo Give a proper message instead of returning the DB row
   * @todo Properly check if the body params are fulfilled
   */
  router.post('/newComment/:ContentID', authenticateToken, async (req, res) => {
    try {
      const contentID = req.params.ContentID
      const doc = req.body;
      const username = doc.username
      const text = doc.text
      const email = await getEmail (username)
      if (!email || !username) return res.status(404).send('User not found');
      if (!text) return res.status(404).send('Cannot leave a blank comment');

      // Attempt to enter comment
      const result = await sbd.query(`INSERT INTO Comment (UserEmail, ContentID, CommentText, CreationDate) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,[email, contentID, text]);
      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error in /newComment/:ContentID', error);
      res.status(500).send('Server error');
    }
  })
  
  /**
   * Fetchs a page of comments left on a piece of content
   * @route {GET} /api/comments/{ContentID}?page={page}&count={count}
   * @routeparam {String} :ContentID The ID of a piece of content
   * @queryparam {number} page The page that the data is being fetched for. Offsets the result from the database
   * @queryparam {number} count The number of comments to fetch from the database, aka, the number of items per page
   * @returns An array of comment data or a string containing an error message
   */
  router.get('/comments/:ContentID', async (req, res) => {
    //Calculate where we start taking the comments + error handling
    if(!parseInt(req.query.count) || req.query.count<0) req.query.count = 20;
    const limit = req.query.count;
    if(!parseInt(req.query.page) || req.query.page<1) req.query.page = 1;
    const offset = req.query.count*(req.query.page - 1);

    //Use AuthorEmail to get the rest of the stuff from SQL
    const result = await sbd.query(`SELECT u.Username,u.CreationDate AS ucd,c.CreationDate AS ccd,c.CommentText
                                    FROM Comment c LEFT JOIN UserAccount u
                                    ON UserEmail = Email
                                    WHERE contentid = $1
                                    ORDER BY c.CreationDate DESC
                                    LIMIT $2 OFFSET $3`,[req.params.ContentID,limit,offset]);
    res.status(200).send(result.rows);
  });

  /**
   * Gets the total number of comments left on a piece of content
   * @route {GET} /api/commentCount/{ContentID}
   * @routeparam {String} :ContentID The ID of a piece of content
   * @returns An object containing the number of items at key count or a string containing an error message
   */
  router.get('/commentCount/:ContentID', async (req, res) => {
    const result = await sbd.query(`SELECT COUNT (*)
                                    FROM Comment
                                    WHERE contentid = $1`,[req.params.ContentID]);
    if (result.rows.length === 0) res.status(404).send('Not Found');
    else res.status(200).send(result.rows[0]);
  });

  export default router;
