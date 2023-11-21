import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import express from "express";
import sbd from "../db/sqlConn.js";
import mdb from "../db/mongoConn.js";
import { ObjectId } from "mongodb";

const secretKey = 'secretkey' // This should probably be placed in an ENV file if this were in prod

const router = express.Router();

process.on('uncaughtException', function (err) {
  console.log(err);
});

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send('Unauthorized')

  jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).send('Forbidden')

      req.user = user;
      next();
  });
}

//Basic login
// This will need huge security imrprovements if this is going to run in prod
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Get password from database
  const result = await sbd.query(`SELECT Password
                                  FROM UserAccount 
                                  WHERE Username = $1
                                  LIMIT 1`, [username]);
  if (result.rows.length === 0) {
    res.status(401).send('Invalid credentials')
    return
  }
  const dbPassword = result.rows[0].password

  // Check if password matched. This is probably not very secure and should be changed
  if (password === dbPassword) {
      const token = jwt.sign({ username }, secretKey);
      res.json({ token })
  } else {
    res.status(401).send('Invalid credentials')
  }
});

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).send('Access granted');
});

export default router;