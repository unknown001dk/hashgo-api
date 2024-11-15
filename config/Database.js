import mongoose from 'mongoose';

export const connectDB = () => {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Database connection failed:', error));
};
