import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Allow requests from multiple origins
const corsOptions = {
  origin: ['https://hashgo.vercel.app', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS for all routes with specified options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Additional headers setup (optional if not required by the API)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
