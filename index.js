import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Dynamic CORS Configuration
const allowedOrigins = ['https://hashgo.vercel.app', 'https://hashgo-react.vercel.app']; // Add more allowed origins as needed
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies or other credentials
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  })
);

// Explicitly handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.use((req, res, next) => {
  console.log(`Request Origin: ${req.headers.origin}`);
  next();
});

app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    logger.error(`Request timed out: ${req.method} ${req.originalUrl}`);
    return res.status(504).json({ message: "Request Timeout" });
  });
  next();
});

// Routes
app.use('/api/v1/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send('API is running...');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
