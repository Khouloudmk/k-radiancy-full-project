// Import mongoose for MongoDB object modeling
import mongoose from 'mongoose';

// Define the schema for an order
const orderSchema = new mongoose.Schema(
  {
    // Array of items in the order
    orderItems: [
      {
        // Product slug (URL-friendly string)
        slug: { type: String, required: true },
        // Product name
        name: { type: String, required: true },
        // Quantity ordered
        quantity: { type: Number, required: true },
        // Product image URL
        image: { type: String, required: true },
        // Price per item
        price: { type: Number, required: true },
        // Reference to the Product document
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    // Shipping address details
    shippingAddress: {
      fullName: { type: String, required: true },   // Recipient's full name
      address: { type: String, required: true },    // Street address
      city: { type: String, required: true },       // City
      postalCode: { type: String, required: true }, // Postal code
      country: { type: String, required: true },    // Country
    },
    // Payment method used (e.g., PayPal, Stripe)
    paymentMethod: { type: String, required: true },
    // Payment result details (from payment gateway)
    paymentResult: {
      id: String,            // Payment transaction ID
      status: String,        // Payment status
      update_time: String,   // Last update time from payment gateway
      email_address: String, // Payer's email address
    },
    // Total price of items (before shipping/tax)
    itemsPrice: { type: Number, required: true },
    // Shipping cost
    shippingPrice: { type: Number, required: true },
    // Tax amount
    taxPrice: { type: Number, required: true },
    // Total order price (items + shipping + tax)
    totalPrice: { type: Number, required: true },
    // Reference to the User who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Whether the order is paid
    isPaid: { type: Boolean, default: false },
    // Date/time when the order was paid
    paidAt: { type: Date },
    // Whether the order is delivered
    isDelivered: { type: Boolean, default: false },
    // Date/time when the order was delivered
    deliveredAt: { type: Date },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model for use in other files
export default Order;