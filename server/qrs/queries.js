import express from "express";
import sbd from "../db/sqlConn.js";
import mdb from "../db/mongoConn.js";

const router = express.Router();

//MONGO
    //CONTENT
// Get a single post
router.get('/content/:ContentID', async (req, res) => {
  const conID = req.params.ContentID;
  let collection = mdb.collection('exContent');
  let query = {ContentID: conID};
  let result = await collection.findOne(query,{projection: {_id: 0}});

  if (!result) res.send('Not found').status(404);
  else res.send(result).status(200);
});

//SQL
    //USER
//add profile pic
router.get('/profile/short/:Email', async (req, res) => {
    const email = req.params.Email;
    const result = await sbd.query('SELECT Username, CreationDate, AccountStatus FROM UserAccount WHERE Email = $1', [email]);
    
    if (!result) res.send('Not found').status(404);
    else res.send(result.rows[0]).status(200);
  });
  
  //add profile pic
  router.get('/profile/:Username', async (req, res) => {
    const username = req.params.Username;
    const result = await sbd.query('SELECT Email, Username, AccountType, CreationDate, AccountStatus, Bio FROM UserAccount WHERE Username = $1', [username]);
    
    if (!result) res.send('Not found').status(404);
    else res.send(result.rows[0]).status(200);
  });
  
    //COMMENT
  router.get('/comment/:CommentID', async (req, res) => {
    const commID = req.params.CommentID;
    const result = await sbd.query('SELECT CommentID, UserEmail, ContentID, CreationDate, CommentText FROM Comment WHERE CommentID = $1', [commID]);
    
    if (!result) res.send('Not found').status(404);
    else res.send(result.rows[0]).status(200);
  });

  export default router;