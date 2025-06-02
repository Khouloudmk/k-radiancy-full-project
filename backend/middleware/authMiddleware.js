// Import jsonwebtoken for verifying JWT tokens
import jwt from 'jsonwebtoken';
// Import User model to fetch user data from database
import User from '../models/User.js';

// Middleware to check if user is authenticated
export const isAuth = async (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with 'Bearer '
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token part after 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find the user by ID from the decoded token payload, exclude password field
      const user = await User.findById(decoded._id || decoded.id).select(
        '-password'
      );
      // If user not found, respond with unauthorized
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' });
      }
      // Attach user object to request for downstream use
      req.user = user;
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // If token verification fails, respond with unauthorized
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided, respond with unauthorized
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  // Check if user exists on request and isAdmin is true
  if (req.user && req.user.isAdmin) {
    // Proceed if user is admin
    next();
  } else {
    // Respond with forbidden if not admin
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};