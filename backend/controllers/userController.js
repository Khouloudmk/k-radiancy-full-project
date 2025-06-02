// Import the User model for database operations
import User from '../models/User.js';
// Import bcryptjs for password hashing and comparison
import bcrypt from 'bcryptjs';
// Import jsonwebtoken for creating and verifying JWT tokens
import jwt from 'jsonwebtoken';
// Import nodemailer for sending emails (e.g., password reset)
import nodemailer from 'nodemailer';

// Helper function to get the base URL for email links
const baseUrl = () => {
  // Use environment variable if set, otherwise default to localhost
  return process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:5000';
};

// Helper function to generate a JWT token for a user
const generateToken = (user) => {
  // Sign a JWT with user ID and admin status, using secret and 30-day expiry
  return jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register a new user
export const signupUser = async (req, res) => {
  try {
    // Destructure name, email, password from request body
    const { name, email, password } = req.body;

    // Check if a user with the same email already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      // If user exists, return error
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password);

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with user info and JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    // Handle errors during registration
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Authenticate user and return JWT token
export const signinUser = async (req, res) => {
  try {
    // Destructure email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    // If user not found or password doesn't match, return error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Respond with user info and JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    // Handle errors during login
    res.status(500).json({ message: 'Login failed' });
  }
};

// Helper function to send password reset email
const sendResetEmail = async (user, token) => {
  try {
    // Create a transporter object using SMTP settings from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Mailtrap doesn't need SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct the password reset URL
    const resetUrl = `${baseUrl()}/reset-password/${token}`;

    // Define email options
    const mailOptions = {
      from: `"K-radiancy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Password',
      html: `
        <p>Hello ${user.name},</p>
        <p>Please click the following link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', user.email);
  } catch (err) {
    // Log and throw error if email sending fails
    console.error('❌ Failed to send email:', err);
    throw new Error('Email delivery failed'); // So `forgetPassword` catches it
  }
};

// Handle forgot password request
export const forgetPassword = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // If user not found, return error
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate a reset token (JWT) valid for 3 hours
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });

    // Save the reset token to the user document
    user.resetToken = token;
    await user.save();

    // Log the reset URL (for debugging)
    console.log(`${baseUrl()}/reset-password/${token}`);

    // Send the reset email
    await sendResetEmail(user, token);

    // Respond with success message
    res.send({ message: 'We sent reset password link to your email.' });
  } catch (error) {
    // Handle errors during password reset process
    console.error('❌ Forget password error:', error);
    res.status(500).send({ message: error.message || 'Error sending email' });
  }
};

// Handle password reset using token
export const resetPassword = async (req, res) => {
  try {
    // Verify the reset token
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        // If token invalid or expired, return error
        return res.status(401).send({ message: 'Invalid Token' });
      }

      // Find user by reset token
      const user = await User.findOne({ resetToken: req.body.token });
      if (!user) {
        // If user not found, return error
        return res.status(404).send({ message: 'User not found' });
      }

      // Check if new password is provided
      if (!req.body.password) {
        return res.status(400).send({ message: 'Password is required' });
      }

      // Hash and set the new password, clear the reset token
      user.password = bcrypt.hashSync(req.body.password, 8);
      user.resetToken = ''; // Clear token
      await user.save();

      // Respond with success message
      res.send({ message: 'Password reset successfully' });
    });
  } catch (error) {
    // Handle errors during password reset
    console.error(error);
    res.status(500).send({ message: 'Error resetting password' });
  }
};

// Get a user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    // Find user by ID, exclude password field
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      // Respond with user data
      res.json(user);
    } else {
      // If user not found, return error
      res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    // Handle errors during fetch
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a user by ID (admin only)
export const updateUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    if (user) {
      // Update user fields if provided, otherwise keep existing
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      // Save updated user
      const updatedUser = await user.save();
      // Respond with updated user data
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      // If user not found, return error
      res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    // Handle errors during update
    res.status(500).json({ message: 'Update failed' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude password field
    const users = await User.find({}).select('-password');
    // Respond with users array
    res.json(users);
  } catch (error) {
    // Handle errors during fetch
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update the profile of the currently authenticated user
export const updateUserProfile = async (req, res) => {
  try {
    // Find user by ID from JWT (req.user._id)
    const user = await User.findById(req.user._id);
    if (user) {
      // Update name and email if provided
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // If password is provided, hash and update it
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password);
      }

      // Save updated user
      const updatedUser = await user.save();
      // Respond with updated user data and new token
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      // If user not found, return error
      res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    // Handle errors during update
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete a user by ID (admin only)
export const deleteUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    if (user) {
      // Delete user from database
      await user.deleteOne();
      // Respond with success message
      res.json({ message: 'User deleted successfully' });
    } else {
      // If user not found, return error
      res.status(404).json({ message: 'User Not Found' });
    }
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({ message: 'Delete failed' });
  }
};