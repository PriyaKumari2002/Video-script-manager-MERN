import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import scriptRoutes from './routes/scripts.js';
import authRoutes from './routes/auth.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.get('/api/health', (_, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
  status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable',
  app: 'Scriptflow API'
}));
app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptRoutes);

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Add your MongoDB Atlas connection string.');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET is required and must be at least 32 characters long.');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Could not start API:', error.message);
    process.exit(1);
  }
  app.listen(port, () => console.log(`API running on ${port}`));
}

startServer();
