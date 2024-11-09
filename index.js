import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();

app.use(express.json());
const corsOptions = {
  origin: 'https://hashgo.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use CORS for all routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Explicitly handle preflight requests

// routes
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).send('API is running...');
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
