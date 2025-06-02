// Import express for creating the router
import express from 'express';
// import Product from '../models/Product.js'; // (Commented out) Import Product model for seeding products
import data from '../Data.js'; // Import seed data (users, products, etc.)
import User from '../models/User.js'; // Import User model for seeding users

// Create a new router instance for seeding
const seedRouter = express.Router();

// Define a GET route for seeding the database
seedRouter.get('/', async (req, res) => {
  try {
    // await Product.deleteMany({}); // (Commented out) Remove all products from the database
    await User.deleteMany({});      // Remove all users from the database

    // Insert users from seed data into the database
    const createdUsers = await User.insertMany(data.users);
    // const createdProducts = await Product.insertMany(data.products); // (Commented out) Insert products

    // res.send({ createdProducts }); // (Commented out) Respond with created products
    res.send({ createdUsers });      // Respond with created users
  } catch (error) {
    // Log and handle errors during seeding
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Seeding failed' });
  }
});

// Export the seed router to be used in the main app
export default seedRouter;