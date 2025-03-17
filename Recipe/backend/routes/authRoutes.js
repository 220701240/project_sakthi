import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ msg: "User already exists!" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({ name, email: normalizedEmail, password: hashedPassword });

    await user.save();
    
    res.status(201).json({ success: true, msg: "User registered successfully!" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required!" });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ msg: "User not found!" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials!" });

    // Generate JWT Token (Store only user ID)
    const token = jwt.sign(
      { userId: user._id.toString() }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      success: true,
      token, 
      user: { id: user._id.toString(), name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

export default router;
