import express from "express";
import sbd from "../db/sqlConn.js";
import mdb from "../db/mongoConn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

process.on('uncaughtException', function (err) {
  console.log(err);
});

//MONGO
    //CONTENT
//api/contentUpload/:UserEmail
router.post('/contentUpload/:UserEmail', async (req, res) => {  
  try{
    let collection = mdb.collection('Content');
    //get JSON doc
    doc = req.get_json();
    //add missing parts?
    doc.authorEmail = req.params.UserEmail;
    doc.updatedDate = doc.creationDate;
    doc.downloads = 0;
    const mappy = doc.mapDat;
    delete doc.mapDat;

    //upload it
    let result = await collection.insertOne(doc);
    if(!result) res.status(420).send('Upload Error');
    res.status(200).send(result.insertedId);
    fs.writeFile("../media/mapData/${result.insertedId}.slf",mappy);

  }catch (error) {
    console.error('Error in /contentUpload/:UserEmail', error);
    res.status(500).send('Server error');
  }
});

//generic content getting function but also it gets average rating for a given content
async function getContent (ContentID, proj){
  let collection = mdb.collection('Content');
  let query = {'_id': new ObjectId(ContentID)};
  let result = await collection.findOne(query, proj);
  if (result.length === 0) return false;
  const AR = await sbd.query(`SELECT avg, Username
                              FROM averageRating, (SELECT username
					                                         FROM UserAccount
					                                         WHERE email = $1)
                              WHERE contentid = $2`, [result.authorEmail, ContentID]);
  if (AR.rows.length === 0) return false;
  result.avgRat = AR.rows[0].avg;
  result.username = AR.rows[0].username;
  delete result.authorEmail;
  return result;
};

//api/contentDetails/:ContentID
router.get('/contentDetails/:ContentID', async (req, res) => {  
  try {
    let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    res.status(200).send(result);
  }catch (error) {
    console.error('Error in /contentDetails/:ContentID', error);
    res.status(500).send('Server error');
  }
});

//api/contentCard/:ContentID
router.get('/contentCard/:ContentID', async (req, res) => {
  try{
    let proj = {projection: {_id:0, contentType:0, contentFileSize:0, creationDate:0, description:0}}
    const result = await getContent(req.params.ContentID,proj);
    if(!result) res.status(404).send('Not found');
    else res.status(200).send(result);
  }catch (error) {
    console.error('Error in /contentCard/:ContentID', error);
    res.status(500).send('Server error');
  }
});

//api/browseContent?page={page}&count={count}&sortBy={sortBy}&tags={tags}&searchString={searchString}
router.get('/browseContent', async (req, res) => {
  try{
      //get queries
    //page
    if(!parseInt(req.query.page) || req.query.page<1) req.query.page = 1;
    var off = parseInt(req.query.count)*(parseInt(req.query.page)-1);
    //count
    if(!parseInt(req.query.count) || req.query.count<0) req.query.count = 20;
    var lim = parseInt(req.query.count);
    //sortBy
    if(req.query.sortBy === 'downloads') var sort = {'downloads': -1};
    else if (req.query.sortBy === 'rating') {var sort = {}; off=0; lim=0;} //rating has special circumstances because its a SQL table
    else var sort = {'updatedDate': -1};
    //tags
    var query = {}; //if neither tags nor searchString
    if(req.query.tags){
      const fulltag = req.query.tags;
      var tag = fulltag.split(',');
    }
    //searchString
    if(req.query.searchString) 
    var sea = req.query.searchString;
  
    //if tags and searchString
    if(req.query.tags && req.query.searchString){
      query = {$and: [{$text: {$search: sea}}]};
        //filling the query with tags
      query.$and[1] = {$or: [{'tags': tag[0]}]};
      for (var q = 1; q < tag.length; q++)
        query.$or[q] = {'tags': tag[q]};
    }//if just tags
    else if(req.query.tags){
      query = {$or: [{'tags': tag[0]}]};
      for (var q = 1; q < tag.length; q++)
        query.$or[q] = {'tags': tag[q]};
    }//if just searchString
    else if(req.query.searchString) query = {$text: {$search: sea}}; 

    //making it case insensitive
    const coll = {locale:'en',strength: 1};
    const proj = { _id: 1};

    let collection = mdb.collection('Content');
    let result = await collection.find(query).collation(coll)
    .project(proj).sort(sort)
    .skip(off).limit(lim)
    .toArray();
    if(!result) res.status(404).send('Not found');

    //for sorting by rating
    if(!Object.keys(sort).length){
      const AR = await sbd.query(`SELECT *
                                  FROM averageRating
                                  ORDER BY avg DESC`);
      if(AR.rows.length === 0) res.status(404).send('Not found');

      //the sorting algorithm
      var temp = [];
      let x = 0;
      let y = 0;
      var located;
      for (let i=0;i<result.length;){
        located = false;
        for (var p=0;p<result.length;p++) 
          if (AR.rows[y].contentid == result[p]._id.toString()) {located = true; break;}
        if (located) {temp[x++] = {_id: result[p]._id}; i++;}
        y++;
      }

      off = parseInt(req.query.count)*(parseInt(req.query.page)-1);
      lim = off + parseInt(req.query.count);
      result = temp.slice(off,lim);
    }
    res.status(200).send(result);
  }catch (error) {
      console.error('Error in /browseContent', error);
      res.status(500).send('Server error');
  }
});

//SQL
    //USER
//add rating
router.get('/fullprofile/:Username', async (req, res) => {
  try {
    const username = req.params.Username;
    // Fetch user's profile details from PostgreSQL
    const userProfileQuery = `SELECT Email, Username, AccountType, CreationDate, AccountStatus, Bio 
                              FROM UserAccount 
                              WHERE Username = $1;`
    const userResult = await sbd.query(userProfileQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).send('Not found');
    }

    const userProfile = userResult.rows[0];
    
    // Fetch user's content IDs from MongoDB
    const contents = await mdb.collection('Content')
      .find({ authorEmail: userProfile.email })
      .project({ _id: 1 })
      .toArray();
    
    if (contents.length === 0) {
      // Set average rating to null if user has no content
      userProfile.AverageRating = null;
    } else {
      // Extract content IDs
      const contentIDs = contents.map(c => c.ContentID);

      // Fetch average ratings for these content IDs from PostgreSQL's 'averagerating' view
      const ratingsQuery = `SELECT AVG(avg) AS AverageRating
                            FROM averagerating
                            WHERE ContentID = ANY($1);`
      const ratingsResult = await sbd.query(ratingsQuery, [contentIDs]);

      // Set average rating to null if there are no ratings
      userProfile.AverageRating = ratingsResult.rows[0] ? ratingsResult.rows[0].averagerating : null;
    }

    res.status(200).send(userProfile);
  } catch (error) {
    console.error('Error in /fullprofile/:Username', error);
    res.status(500).send('Server error');
  }
});
  
    //COMMENT 
//api/comments/{ContentID}?page={page}&count={count}
router.get('/comments/:ContentID', async (req, res) => {
    //Calculate where we start taking the comments + error handling
    if(!parseInt(req.query.page) || req.query.page<1) req.query.page = 1;
    const offset = req.query.count*(req.query.page-1);
    if(!parseInt(req.query.count) || req.query.count<0) req.query.count = 20;
    const limit = req.query.count;

    console.log ("FUCK")

    //Use AuthorEmail to get the rest of the stuff from SQL
    const result = await sbd.query(`SELECT u.Username,u.CreationDate AS ucd,c.CreationDate AS ccd,c.CommentText
                                    FROM Comment c LEFT JOIN UserAccount u
                                    ON UserEmail = Email
                                    WHERE contentid = $1
                                    ORDER BY c.CreationDate DESC
                                    LIMIT $2 OFFSET $3`,[req.params.ContentID,limit,offset]);
    if (result.rows.length === 0) res.status(404).send('Not Found');
    else res.status(200).send(result.rows);
});

//api/commentCount/{ContentID}
router.get('/commentCount/:ContentID', async (req, res) => {
  try {
    const result = await sbd.query(`SELECT COUNT (*)
                                    FROM Comment
                                    WHERE contentid = $1`,[req.params.ContentID]);
    if (result.rows.length === 0) res.status(404).send('Not Found');
    else res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error ('Error in /commentCount/:ContentID', error)
    res.status(500).send('Server error')
  }
});

export default router;
