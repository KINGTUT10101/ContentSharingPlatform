import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import query from './qrs/queries.js';
import login from './qrs/login.js';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;
const app = express();
let corsOptions = {
  origin: `http://localhost:${PORT}`
};

// Replace __dirname with a similar variable using the new ES Modules syntax
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use (express.json ())
app.use(express.urlencoded({ extended: true }));
dotenv.config({ path: './config/config.env' });
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// For delivering files to the user
app.use('/media', express.static(path.join (__dirname, "media")));

// API Functions should look like this
// Make sure they start with "/api" so they don't conflict with the frontend pages
app.get('/api/test', (req, res) => {
  res.send('Server running');
});

//Queries and login
app.use('/api', query);
app.use('/api', login);

// Serves the static frontend content
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
