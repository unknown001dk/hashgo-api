import mongoose from 'mongoose';

export const connectDB = () => {
  mongoose.connect(process.env.MONGO_URL);
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected...');
  });
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });
}