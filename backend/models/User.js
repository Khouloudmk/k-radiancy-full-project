// Import mongoose for MongoDB object modeling
import mongoose from 'mongoose';

// Define the schema for a user
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,   // Name is required
      trim: true,       // Remove whitespace from both ends
    },
    // User's email address
    email: {
      type: String,
      required: true,   // Email is required
      unique: true,     // Email must be unique in the database
      lowercase: true,  // Store email in lowercase
    },
    // User's hashed password
    password: {
      type: String,
      required: true,   // Password is required
      minlength: 6,     // Minimum password length is 6 characters
    },
    // Boolean flag for admin users
    isAdmin: {
      type: Boolean,
      default: false,   // Default is not admin
      required: true    // Always required
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other files
export default User;