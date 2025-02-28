import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import dotenv from "dotenv";
dotenv.config(); // ✅ Correct way in ES modules
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Ensure email is extracted correctly

  try {
    if (typeof email !== "string") {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const user = await User.findOne({ email }); // Find user by string email
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT Token (Store only user ID)
    const token = jwt.sign(
      { userId: user._id.toString() }, // Convert ID to string
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      token, 
      user: { id: user._id.toString(), name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
