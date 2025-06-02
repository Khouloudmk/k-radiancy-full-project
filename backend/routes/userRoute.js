import express from 'express'; // Import express for creating the router
import {
  signinUser,         // Controller for user login
  signupUser,         // Controller for user registration
  forgetPassword,     // Controller for requesting password reset
  resetPassword,      // Controller for resetting password
  deleteUserById,     // Controller for deleting a user by ID (admin)
  updateUserById,     // Controller for updating a user by ID (admin)
  getUserById,        // Controller for getting a user by ID (admin)
  getAllUsers,        // Controller for getting all users (admin)
  updateUserProfile   // Controller for updating the logged-in user's profile
} from '../controllers/userController.js';
import { isAuth, isAdmin } from '../middleware/authMiddleware.js'; // Import authentication and admin-check middleware

const router = express.Router(); // Create a user router instance

// Public routes (no authentication required)
router.post('/signin', signinUser);            // User login route
router.post('/signup', signupUser);            // User registration route
router.put('/profile', isAuth, updateUserProfile); // Update logged-in user's profile (requires authentication)
router.post('/forget-password', forgetPassword);    // Request password reset (public)
router.post('/reset-password', resetPassword);      // Reset password using token (public)

// Admin-only routes (require authentication and admin privileges)
router.get('/', isAuth, isAdmin, getAllUsers);         // Get all users (admin only)
router.delete('/:id', isAuth, isAdmin, deleteUserById); // Delete user by ID (admin only)
router.put('/:id', isAuth, isAdmin, updateUserById);    // Update user profile by ID (admin only)
router.get('/:id', isAuth, isAdmin, getUserById);       // Get user by ID (admin only)

export default router; // Export the router to be used in the main app