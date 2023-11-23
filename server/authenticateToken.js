import jwt from 'jsonwebtoken';
import secretKey from "./secretKey.js"

export default function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send('Unauthorized')

  jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).send('Forbidden')

      req.user = user;
      next();
  });
}