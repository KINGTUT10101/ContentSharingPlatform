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
async function getContent (ContentID, proj){
  let collection = mdb.collection('Content');
  let query = {'_id': new ObjectId(ContentID)};
  let result = await collection.findOne(query, proj);
  if (!result) return -1;
  const AR = await sbd.query(`SELECT avg, Username
                              FROM averageRating, (SELECT username
					                                         FROM UserAccount
					                                         WHERE email = $1)
                              WHERE contentid = $2`, [result.AuthorEmail, ContentID]);
  if (!AR) {return -1;}
  result.avgRat = AR.rows[0].avg;
  result.username = AR.rows[0].username;
  delete result.AuthorEmail;
  return result;
};

//api/contentDetails/:ContentID
router.get('/contentDetails/:ContentID', async (req, res) => { 
  let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0}}
  const result = await getContent(req.params.ContentID,proj);
  if(!result) res.send('Not found').status(404);
  res.send(result).status(200);
});

//api/contentCard/:ContentID
router.get('/contentCard/:ContentID', async (req, res) => {
  let proj = {projection: {_id:0, ContentType:0, ContentFileSize:0, CreationDate:0, Description:0}}
  const result = await getContent(req.params.ContentID,proj);
  if(!result) res.send('Not found').status(404);
  else res.send(result).status(200);
});

//SQL
    //USER
  //add profile pic
  router.get('/fullprofile/:Username', async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query(`SELECT Email, Username, AccountType, CreationDate, AccountStatus, Bio 
                                    FROM UserAccount 
                                    WHERE Username = $1`, [username]);
    if (!result) res.send('Not found').status(404);
    else res.send(result.rows[0]).status(200);
  });
  
    //COMMENT 
  //api/comments/{ContentID}?page={page}&count={count}
  router.get('/comments/:ContentID', async (req, res) => {
    //Calculate where we start taking the comments + error handling
    if(!parseInt(req.query.count) || req.query.count<0) req.query.count = 20;
    const limit = req.query.count;
    if(!parseInt(req.query.page) || req.query.page<0) req.query.page = 0;
    const offset = req.query.count*req.query.page;

    //Use AuthorEmail to get the rest of the stuff from SQL
    const result = await sbd.query(`SELECT u.Username,u.CreationDate AS ucd,c.CreationDate AS ccd,c.CommentText
                                    FROM Comment c LEFT JOIN UserAccount u
                                    ON UserEmail = Email
                                    WHERE contentid = $1
                                    ORDER BY c.CreationDate DESC
                                    LIMIT $2 OFFSET $3`,[req.params.ContentID,limit,offset]);
    if (!result) res.send('Not Found').status(404);
    else res.send(result.rows).status(200);
  });

  export default router;
