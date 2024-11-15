import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

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
