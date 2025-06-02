// Import the Order model for database operations
import Order from '../models/Order.js';
// Import the User model for user-related queries (used in summary)
import User from '../models/User.js';

// Create new order
const createOrder = async (req, res) => {
  try {
    // Destructure order details from request body
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    // Check if orderItems array is empty or missing
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create a new Order instance with provided details and the user ID from JWT
    const order = new Order({
      orderItems,
      user: req.user._id, // User placing the order
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Save the new order to the database
    const createdOrder = await order.save();
    // Respond with the created order
    res.status(201).json(createdOrder);
  } catch (error) {
    // Handle errors during order creation
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    // Find order by ID and populate user field with name and email
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (order) {
      // If order found, return it
      res.json(order);
    } else {
      // If not found, return error
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    // Handle errors during fetch
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

    if (order) {
      // Mark order as paid and set paidAt timestamp
      order.isPaid = true;
      order.paidAt = Date.now();
      // Store payment result details (from payment gateway)
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      // Save updated order
      const updatedOrder = await order.save();
      // Respond with updated order
      res.json(updatedOrder);
    } else {
      // If order not found, return error
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    // Handle errors during update
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    // Find all orders for the current user
    const orders = await Order.find({ user: req.user._id });
    // Respond with orders array
    res.json(orders);
  } catch (error) {
    // Handle errors during fetch
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate user field with name and email
    const orders = await Order.find().populate('user', 'name email');
    // Respond with orders array
    res.json(orders);
  } catch (error) {
    // Handle errors during fetch
    console.error('Get Orders Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get order summary for dashboard (admin only)
const getOrderSummary = async (req, res, next) => {
  try {
    // Run multiple aggregations in parallel for dashboard summary
    const [
      ordersSummary,    // Main order stats (count, sales, avg, etc.)
      usersCount,       // Total number of users
      dailyOrders,      // Orders and sales per day
      productCategories,// Sales by product category
      orderStatus,      // Paid/delivered counts
      recentOrders,     // 5 most recent orders
    ] = await Promise.all([
      // 1. Main orders summary with fixed item counting
      Order.aggregate([
        { $unwind: '$orderItems' }, // Flatten orderItems array
        {
          $group: {
            _id: '$_id',
            orderTotal: { $first: '$totalPrice' },
            shipping: { $first: '$shippingPrice' },
            tax: { $first: '$taxPrice' },
            totalItems: { $sum: '$orderItems.quantity' },
          },
        },
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$orderTotal' },
            avgOrderValue: { $avg: '$orderTotal' },
            totalItemsSold: { $sum: '$totalItems' },
            totalShipping: { $sum: '$shipping' },
            totalTax: { $sum: '$tax' },
          },
        },
      ]),

      // 2. Users count
      User.aggregate([{ $group: { _id: null, numUsers: { $sum: 1 } } }]),

      // 3. Daily orders (grouped by date)
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
            itemsSold: { $sum: { $sum: '$orderItems.quantity' } },
          },
        },
        { $sort: { _id: 1 } }, // Sort by date ascending
      ]),

      // 4. Product categories (sales and count by category)
      Order.aggregate([
        { $unwind: '$orderItems' },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        {
          $group: {
            _id: '$productDetails.category',
            count: { $sum: '$orderItems.quantity' },
            revenue: {
              $sum: {
                $multiply: ['$orderItems.price', '$orderItems.quantity'],
              },
            },
          },
        },
        { $sort: { revenue: -1 } }, // Sort by revenue descending
      ]),

      // 5. Status counts (paid and delivered orders)
      Order.aggregate([
        {
          $group: {
            _id: null,
            paidOrders: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$isDelivered', true] }, 1, 0] },
            },
          },
        },
      ]),

      // 6. Recent orders (latest 5, with user info)
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
    ]);

    // Build summary object for dashboard
    const summary = {
      overview: {
        ...(ordersSummary[0] || {
          numOrders: 0,
          totalSales: 0,
          avgOrderValue: 0,
          totalItemsSold: 0,
          totalShipping: 0,
          totalTax: 0,
        }),
        numUsers: usersCount[0]?.numUsers || 0,
        ...(orderStatus[0] || {
          paidOrders: 0,
          deliveredOrders: 0,
        }),
      },
      trends: {
        dailyOrders,
        productCategories,
      },
      recentOrders,
    };

    // Respond with the summary data
    res.json(summary);
  } catch (error) {
    // Handle errors during summary generation
    console.error('Order summary error:', error);
    res.status(500).json({
      message: 'Error generating order summary',
      error: error.message,
    });
  }
};

// Update order to delivered (admin only)
const updateOrderToDelivered = async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);

    if (order) {
      // Mark order as delivered and set deliveredAt timestamp
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // Save updated order
      const updatedOrder = await order.save();
      // Respond with updated order
      res.json(updatedOrder);
    } else {
      // If order not found, return error
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    // Handle errors during update
    res.status(500).json({ message: error.message });
  }
};

// Delete an order by ID (admin only)
const deleteOrder = async (req, res) => {
  try {
    // Find order by ID
    const order = await Order.findById(req.params.id);
    if (order) {
      // Delete the order from the database
      await order.deleteOne(); // Modern method
      // Respond with success message
      res.send({ message: 'Order Deleted' });
    } else {
      // If order not found, return error
      res.status(404).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    // Handle errors during deletion
    console.error('Error deleting order:', error.message);
    res.status(500).send({ message: 'Server Error' });
  }
};

// Export all controller functions for use in routes
export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  getOrderSummary,
  updateOrderToDelivered,
  deleteOrder,
};