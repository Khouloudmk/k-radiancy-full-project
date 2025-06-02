import express from 'express'; // Import express for creating the server and handling routes
import mongoose from 'mongoose'; // Import mongoose for MongoDB object modeling
import dotenv from 'dotenv'; // Import dotenv to load environment variables from .env file
import productRoute from './routes/productRoute.js'; // Import product routes
import userRoute from './routes/userRoute.js'; // Import user routes
// import seedRouter from './routes/seedRoutes.js'; // Import seed routes for seeding database
import orderRoute from './routes/orderRoute.js'; // Import order routes
import uploadRouter from './routes/uploadRoute.js'; // Import upload routes

dotenv.config(); // Load environment variables from .env file

// Initialize Express app
const app = express();

// Middleware to parse JSON body requests
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Use new URL parser (recommended)
    useUnifiedTopology: true, // Use new server discovery and monitoring engine
  })
  .then(() => {
    console.log('✅ Connected to MongoDB'); // Log success message if connected
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message); // Log error if connection fails
  });

// Routes
app.use('/api/upload', uploadRouter); // Mount upload routes 
app.use('/api/products', productRoute); // Mount product routes 
app.use('/api/users', userRoute); // Mount user routes 
app.use('/api/orders', orderRoute); // Mount order routes 
// app.use('/api/seed', seedRouter);    // Mount seed routes 

// Default route
app.get('/', (req, res) => {
  res.send('API is running...'); // Respond with a simple message for the root URL
});



// Start server
const port = process.env.PORT || 6000; // Use port from environment or default to 6000
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`); // Log server start message
});
