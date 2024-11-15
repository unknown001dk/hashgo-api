import User from "../models/user.modal.js";
import { UserRegmail } from "./email.controller.js";

export const userRegister = async (req, res) => {
  const { name, email, phoneNumber, course } = req.body;

  try {
    // Validate inputs
    if (!name || !email || !phoneNumber || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format (if needed)
    // const phoneRegex = /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   return res.status(400).json({ message: "Invalid phone number format" });
    // }

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create new user
    const newUser = new User({ name, email, phoneNumber, course });
    await newUser.save();

    // Send registration email
    try {
      await UserRegmail(req, res);
    } catch (emailError) {
      return res.status(500).json({
        message: "User registered, but failed to send confirmation email.",
        error: emailError.message || "Internal Server Error",
      });
    }

    // Send success response with user details
    return res.status(201).json({
      message: "User registration successful",
      user: { name, email, phoneNumber, course },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message || "Internal Server Error",
    });
  }
};
