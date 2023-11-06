import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

const PORT = process.env.PORT || 5000;
const app = express()
let corsOptions = {
  origin: `http://localhost:{PORT}`
};

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
dotenv.config({ path: './config/config.env' })
app.use(express.static('client/build'));

// API Functions go here
app.get('/test', (req, res) => {
  res.send('Server running')
});

// Serves the static frontend content
// Make sure the API paths don't conflict with the React Router paths in client/src/App.js
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));