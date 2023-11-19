import express from "express";
import sbd from "../db/sqlConn.js";
import mdb from "../db/mongoConn.js";
import { ObjectId } from "mongodb";

const router = express.Router();
/*
process.on('uncaughtException', function (err) {
  console.log(err);
});
*/
//MONGO
    //CONTENT
// Get a single post
router.get('/content/:ContentID', async (req, res) => {
  const conID = req.params.ContentID;
  let collection = mdb.collection('Content');
  let query = {'_id': new ObjectId(conID)};
  let result = await collection.findOne(query);
  if (!vlad){ res.send('Not Found').status(404); return -1;}
  if (!result) res.send('Not found').status(404);
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
                                        /*****IMAGES STILL NEEDED*****/
  //api/comments/{ContentID}?page={page}&count={count}
  router.get('/comments/:ContentID', async (req, res) => {
    //Calculate where we start taking the comments
    if(!parseInt(req.query.count) || req.query.count<0) req.query.count = 20;
    const limit = req.query.count;
    if(!parseInt(req.query.page) || req.query.page<0) req.query.page = 0;
    const offset = req.query.count*req.query.page;

    //Use AuthorEmail to get the rest of the stuff from SQL
    const result = await sbd.query(`SELECT u.UserName,u.CreationDate AS ucd,c.CreationDate AS ccd,c.CommentText
                                    FROM Comment c LEFT JOIN UserAccount u
                                    ON UserEmail = Email
                                    WHERE contentid = $1
                                    ORDER BY c.CreationDate DESC
                                    LIMIT $2 OFFSET $3`, [req.params.ContentID,limit,offset]);
    if (!result) res.send('Not Found').status(404);
    else res.send(result.rows).status(200);
  });

  //image
  router.get('/image/:id', async (req, res) => {
    const result = await sbd.query('SELECT imagefile FROM testimage WHERE id = $1', [req.params.id]);
    
    if (!result) res.send('Not found').status(404);
    else if (result.rows[0] == null) res.send('../media/default_pfp/blankpfp.png').status(200);
    else res.send(result.rows).status(200);
  });

  export default router;
