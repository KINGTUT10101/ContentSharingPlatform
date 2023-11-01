import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

let corsOptions = {
  origin: `http://localhost:{PORT}`
};

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
dotenv.config({ path: './config/config.env' })

const app = express();

app.get('/', (req, res) => res.send('Server running'));



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));