import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = process.env.VERCEL === '1';

let dbConnectionPromise = null;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (dbConnectionPromise) {
    await dbConnectionPromise;
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/peer-project-hub';

  dbConnectionPromise = mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });

  await dbConnectionPromise;
};

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://peer-kimv.vercel.app',
  ...(process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments for this project naming pattern
    if (/^https:\/\/peer-[a-z0-9-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Return false rather than throwing to avoid turning CORS denial into 500s.
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (does not require DB)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Peer Project Hub API is running',
    timestamp: new Date().toISOString()
  });
});

// Ensure DB connectivity before protected API routes.
app.use('/api', async (req, res, next) => {
  // Health endpoint is intentionally DB-agnostic.
  if (req.path === '/health') {
    return next();
  }

  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

if (!isVercel) {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
    });
}

export default app;
