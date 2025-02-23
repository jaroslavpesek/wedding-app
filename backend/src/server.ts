import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import accessCodeRouter from './accessCodeCheck';
import registerGuest from './registerGuest';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT ? parseInt(process.env.PORT) : undefined;
const mongoURI = process.env.MONGO_URI;

if (!host) {
  console.error('No host specified');
  process.exit(1);
}

if (!port) {
  console.error('No port specified');
  process.exit(1);
}

if (!mongoURI) {
  console.error('No MongoDB URI specified');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB at", mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected.');

    // Test route
    app.get('/', (req: Request, res: Response) => {
      res.send('Hello from Wedding App Backend!');
    });

    // Verify code route
    app.get('/verify/:code', accessCodeRouter);

    // Register guest route
    app.post('/register', registerGuest);

    // Start server
    app.listen(port, host, () => {
      console.log(`Server running at ${host}:${port}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();
