// Import express for creating the router
import express from 'express';
// Import product controller functions for handling product logic
import {
  getProducts,           // Get all products
  getProductBySlug,      // Get a product by its slug
  // getCategories,      // (Commented out) Get all product categories
  getAdminProducts,      // Get paginated products for admin
  searchProducts,        // Search/filter products
  getProductById,        // Get a product by its MongoDB ID
  // getPopularProducts, // (Commented out) Get popular products
  createProduct,         // Create a new product
  createManyProducts,    // Bulk create products
  createProductReviews,  // Add a review to a product
  updateProduct,         // Update a product by ID
  deleteManyProducts,    // Bulk delete products
  deleteProduct,         // Delete a product by ID
} from '../controllers/productController.js';
// Import authentication and admin-check middleware
import { isAuth, isAdmin } from '../middleware/authMiddleware.js';

// Create a new router instance
const router = express.Router();

// Route to get all products (public)
router.get('/', getProducts);

// Route to get a product by its slug (public)
router.get('/slug/:slug', getProductBySlug);

// Route to get all categories (commented out, not active)
// router.get('/categories', getCategories);

// Route to get paginated products for admin (protected, admin only)
router.get('/admin', isAuth, isAdmin, getAdminProducts);

// Route to search/filter products (public)
router.get('/search', searchProducts);

// Route to get a product by its MongoDB ID (public)
router.get('/:id', getProductById);

// Route to get popular products (commented out, not active)
// router.get('/popular', getPopularProducts);

// Route to create a new product (protected, admin only)
router.post('/', isAuth, isAdmin, createProduct);

// Route to bulk create products (public, adjust as needed for security)
router.post('/many', createManyProducts);

// Route to create a review for a product (should be protected, missing '/:' for id param)
router.post(':id/reviews', createProductReviews); // Consider changing to '/:id/reviews' and adding isAuth

// Route to update a product by ID (public, should be protected for admin)
router.put('/:id', updateProduct);

// Route to bulk delete products (public, should be protected for admin)
router.delete('/many', deleteManyProducts);

// Route to delete a product by ID (public, should be protected for admin)
router.delete('/:id', deleteProduct);

// Export the router to be used in the main app
export default router;