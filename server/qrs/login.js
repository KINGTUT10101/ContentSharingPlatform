import jwt from 'jsonwebtoken';
import express from "express";
import sbd from "../db/sqlConn.js";
import authenticateToken from "../authenticateToken.js"
import secretKey from "../secretKey.js"

const router = express.Router();

process.on('uncaughtException', function (err) {
  console.log(err);
});

/**
 * Generates an authentication token for a user if they provide correct login details
 * @route {POST} /api/login
 * @authentication The user's login token from their localstorage
 * @headerparam {String} Content-Type The type of data contained in the body. Should be application/json
 * @bodyparam {String} username The user's username
 * @bodyparam {String} password The user's password
 * @returns An object containing the token at key token or a string containing an error message
 * @todo This will need huge security improvements if this is going to run in prod
 * @todo We can't just send plaintext passwords in a real website!
 */
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

/**
 * Used to test the token authentication system
 * @route /api/protected
 * @authentication The user's login token from their localstorage
 * @headerparam {String} Content-Type The type of data contained in the body. Should be application/json
 * @headerparam {String} Authorization The local token that proves the user is signed in
 * @returns A string containing a message that indicates the result of the operation
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).send('Access granted');
});

export default router;