import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  try {
    // Check if token is provided in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach it to request object
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to next middleware
    } else {
      res.status(401).json({ msg: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ msg: "Token failed or expired" });
  }
};

export default authMiddleware;
