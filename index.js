import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();

app.use(express.json());
const corsOptions = {
  origin: 'https://hashgo-no-name-technology.vercel.app',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// routes
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {

  res.status(200).send('API is running...');
});

// start the server

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});