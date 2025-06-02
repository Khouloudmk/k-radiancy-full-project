// Import mongoose for MongoDB object modeling
import mongoose from 'mongoose';

// Define the schema for a product
const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
    },
    // Unique slug for the product (used in URLs)
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // Product category (e.g., "Skincare", "Makeup")
    category: {
      type: String,
      required: true,
    },
    // Query field for search optimization (usually lowercase name)
    query: {
      type: String,
      required: true,
    }, // used for search functionality
    // Image path or URL for the product
    image: {
      type: String,
      required: true,
    }, // path to image (e.g., '/images/img1.jpg' or a URL 'https://i.imgur.com/QN2BSdJ.jpg')
    // Product price
    price: {
      type: Number,
      required: true,
    },
    // Number of items in stock
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    // Brand name
    brand: {
      type: String,
      required: true,
    },
    // Average product rating (from reviews)
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    // Number of reviews for the product
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // Product description
    description: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model for use in other files
export default Product;