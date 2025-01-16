import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import accessCodeRouter from './accessCodeCheck';
import registerGuest from './registerGuest';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.ADDR || "127.0.0.1";
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/wedding';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
  });

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Wedding App Backend!');
});

// Verify code route
app.post('/verify', accessCodeRouter);

// Register guest route
app.post('/register', registerGuest);

// Start server
app.listen(port, host, () => {
  console.log(`Server running on http://localhost:${port}`);
});
