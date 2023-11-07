import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;
const app = express();
let corsOptions = {
  origin: `http://localhost:${PORT}`
};

// Replace __dirname with a similar variable using the new ES Modules syntax
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
dotenv.config({ path: './config/config.env' });
app.use(express.static(path.join(__dirname, 'client/build')));

// API Functions should look like this
// Make sure they start with "/api" so they don't conflict with the frontend pages
app.get('/api/test', (req, res) => {
  res.send('Server running');
});

app.get('/api/profile/:Username', (req, res) => {
  res.send({
    Email: "kingtut10101@gmail.com",
    Username: "KINGTUT10101",
    AccountType: "admin",
    CreationDate: {
      day: 1,
      month: 1,
      year: 2021,
    },
    AccountStatus: "active",
    Bio: `
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    `,
    ProfilePicture: null,
  });
});

app.get('/api/content/:ContentID', (req, res) => {
  res.send({
    ThumbnailFilepath: null,
    Title: "My First Map",
    Description: `
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    `,
    CreationDate: {
      day: 3,
      month: 3,
      year: 2021,
    },
    UpdatedDate: {
      day: 3,
      month: 3,
      year: 2021,
    },
    Downloads: 14580,
    Tags: [
      "tutorial",
      "small",
      "cool",
      "official",
    ]
  });
});

// Serves the static frontend content
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
