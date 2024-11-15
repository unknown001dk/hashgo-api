import User from "../models/user.modal.js";
import { UserRegmail } from "./email.controller.js";
import logger from '../utils/logger.js';  // Assuming you've set up a logger

export const userRegister = async (req, res) => {
  const { name, email, phoneNumber, course } = req.body;

  try {
    logger.info('Start user registration');

    // Validate inputs
    if (!name || !email || !phoneNumber || !course) {
      logger.error('Missing fields');
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.error('Invalid email format');
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Email already exists');
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create new user
    const newUser = new User({ name, email, phoneNumber, course });
    await newUser.save();

    // Send registration email asynchronously using setImmediate to avoid blocking
    setImmediate(() => UserRegmail(req, res));

    logger.info('User saved successfully');
    return res.status(201).json({
      message: "User registration successful",
    });
  } catch (error) {
    logger.error('Error during registration:', error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message || "Internal Server Error",
    });
  }
};
