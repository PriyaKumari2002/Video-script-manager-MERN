import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import scriptRoutes from './routes/scripts.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Scriptflow API' }));
app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptRoutes);

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scriptflow';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('Connected to local MongoDB.');
  } catch {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MongoDB connection failed. Add MONGO_URI in deployment environment variables.');
    }
    console.log('Local MongoDB not found. Starting a temporary local database...');
    const memoryDb = await MongoMemoryServer.create();
    await mongoose.connect(memoryDb.getUri());
    console.log('Temporary database is ready (data resets if the backend stops).');
  }
  app.listen(port, () => console.log(`API running on ${port}`));
}

startServer().catch(error => console.error('Could not start API:', error.message));
