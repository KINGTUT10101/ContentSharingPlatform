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

// Gets the user's email from their username
async function getEmail (username) {
  const emailResult = await sbd.query(`SELECT Email
                                        FROM UserAccount 
                                        WHERE Username = $1
                                        LIMIT 1`, [username]);
  if (emailResult.rows.length === 0) return null
  return emailResult.rows[0].email
}

//MONGO
    //CONTENT
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

  //api/contentDetails/:ContentID
  router.get('/contentDetails/:ContentID', async (req, res) => { 
    let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    res.status(200).send(result);
  });

  //api/contentCard/:ContentID
  router.get('/contentCard/:ContentID', async (req, res) => {
    let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0, Description:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    else res.status(200).send(result);
  });

  // Uploads a piece of content to localstorage and the database
  // Ideally, this should probably use formdata or a dedicated service for uploading files
  // It also needs better error handling so the document is removed if a problem occurs
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

  //api/browseContent?page={page}&count={count}&sortBy={sortBy}&tags={tags}&searchString={searchString}
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

  // Counts the total number of items that fit a certain search filter
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
  // Gets all the user's profile details
  router.get('/fullprofile/:Username', async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query(`SELECT Email, Username, AccountType, CreationDate, AccountStatus, Bio 
                                    FROM UserAccount 
                                    WHERE Username = $1`, [username]);
    if (result.rows.length === 0) res.status(404).send('Not found');
    else res.status(200).send(result.rows[0]);
  });

  // Gets the user's email from their username. A temporary solution
  router.get('/getEmail/:Username', authenticateToken, async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query(`SELECT Email
                                    FROM UserAccount 
                                    WHERE Username = $1`, [username]);
    if (result.rows.length === 0) res.status(404).send('Not found');
    else res.status(200).send(result.rows[0]);
  });

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
  
    //COMMENT 
  //api/comments/{ContentID}?page={page}&count={count}
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

  //api/commentCount/{ContentID}
  router.get('/commentCount/:ContentID', async (req, res) => {
    const result = await sbd.query(`SELECT COUNT (*)
                                    FROM Comment
                                    WHERE contentid = $1`,[req.params.ContentID]);
    if (result.rows.length === 0) res.status(404).send('Not Found');
    else res.status(200).send(result.rows[0]);
  });

  export default router;
