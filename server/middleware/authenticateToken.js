import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import your User model

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password field

    if (!user) {
      return res.sendStatus(404); // User not found
    }

    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err);
    res.sendStatus(403); // Forbidden
  }
};
