// Import express for routing
import express from 'express';
// Import order controller functions for handling order logic
import {
  createOrder,
  getOrderSummary,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
  deleteOrder,
} from '../controllers/orderController.js';
// Import authentication and admin-check middleware
import { isAuth, isAdmin } from '../middleware/authMiddleware.js';

// Create a new router instance
const router = express.Router();

// Create a new order (POST) - Protected route, user must be authenticated
router.post('/', isAuth, createOrder);

// Get logged-in user's orders (GET) - Protected route, user must be authenticated
router.get('/mine', isAuth, getMyOrders);

// Get order summary for dashboard (GET) - Admin only, must be authenticated and admin
router.get('/summary', isAuth, isAdmin, getOrderSummary);

// Get order by ID (GET) - Protected route, user must be authenticated
router.get('/:id', isAuth, getOrderById);

// Update order to paid (PUT) - Protected route, user must be authenticated
router.put('/:id/pay', isAuth, updateOrderToPaid);

// Update order to delivered (PUT) - Admin only, must be authenticated and admin
router.put('/:id/deliver', isAuth, isAdmin, updateOrderToDelivered);

// Get all orders (GET) - Admin only, must be authenticated and admin
router.get('/', isAuth, isAdmin, getAllOrders);

// Delete order by ID (DELETE) - Admin only, must be authenticated and admin
router.delete('/:id', isAuth, isAdmin, deleteOrder);

// Export the router to be used in the main app
export default router;