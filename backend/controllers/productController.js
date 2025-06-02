// Import the Product model for database operations
import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    // Respond with the list of products
    res.status(200).json(products);
  } catch (error) {
    // Log and handle errors
    console.error('Get Products Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get product by slug (unique string identifier)
export const getProductBySlug = async (req, res) => {
  try {
    // Find a product by its slug from the URL parameter
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      // If found, return the product
      res.status(200).json(product);
    } else {
      // If not found, return 404
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    // Log and handle errors
    console.error('Get Product By Slug Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get product by MongoDB ID
export const getProductById = async (req, res) => {
  try {
    // Find a product by its ID from the URL parameter
    const product = await Product.findById(req.params.id);
    if (product) {
      // If found, return the product
      res.status(200).json(product);
    } else {
      // If not found, return 404
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    // Log and handle errors
    console.error('Get Product By ID Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Pagination size for admin product listing
const PAGE_SIZE = 10;

// Get paginated list of products (admin only)
export const getAdminProducts = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const { query } = req;
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || PAGE_SIZE;

    // Fetch products for the current page
    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    // Count total number of products
    const countProducts = await Product.countDocuments();

    // Respond with products and pagination info
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Failed to fetch admin products' });
  }
};

// Get products with search and filters
export const searchProducts = async (req, res) => {
  try {
    // Extract search and filter parameters from query string
    const { q, fields = ['name'], Cg, filter, from, to } = req.query;

    let query = {}; // MongoDB query object
    let sortOption = { createdAt: -1 }; // Default sort: newest first

    // Multi-field keyword search
    if (q) {
      const searchRegex = { $regex: q, $options: 'i' }; // Case-insensitive regex

      // Ensure fields is an array
      const searchFields = Array.isArray(fields) ? fields : [fields];

      // Build $or query for all specified fields
      query.$or = searchFields.map((field) => {
        // Support for nested fields (e.g., 'brand.name')
        const fieldPath = field.split('.');
        const fieldQuery = {};
        let current = fieldQuery;

        for (let i = 0; i < fieldPath.length - 1; i++) {
          current[fieldPath[i]] = {};
          current = current[fieldPath[i]];
        }

        current[fieldPath[fieldPath.length - 1]] = searchRegex;
        return fieldQuery;
      });
    }

    // Category filter
    if (Cg) {
      query.category = Cg;
    }

    // Price range filter
    if (from && to) {
      query.price = { $gte: Number(from), $lte: Number(to) };
    } else if (from) {
      query.price = { $gte: Number(from) };
    } else if (to) {
      query.price = { $lte: Number(to) };
    }

    // Sorting options based on filter
    switch (filter) {
      case 'Rating':
        sortOption = { rating: -1 }; // Highest rating first
        break;
      case 'date':
        sortOption = { createdAt: -1 }; // Newest first
        break;
      case 'highprice':
        sortOption = { price: -1 }; // Highest price first
        break;
      case 'lowprice':
        sortOption = { price: 1 }; // Lowest price first
        break;
    }

    // Fetch products matching the query and sort
    const products = await Product.find(query).sort(sortOption);
    // Respond with the filtered products
    res.json(products);
  } catch (error) {
    // Log and handle errors
    console.error('Search error:', error);
    res.status(500).json({
      message: 'Server error during search',
      error: error.message,
    });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Destructure product fields from request body
    const {
      name,
      slug,
      price,
      image,
      category,
      brand,
      stock,
      description,
    } = req.body;

    // Basic field validation
    if (
      !name ||
      !slug ||
      price === undefined ||
      !image ||
      !category ||
      !brand ||
      stock === undefined ||
      !description
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if slug already exists (must be unique)
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Slug must be unique' });
    }

    // Create a new Product instance
    const product = new Product({
      name,
      slug,
      price,
      image,
      category,
      brand,
      stock,
      query: name.toLowerCase(), // For search optimization
      description,
    });

    // Save the product to the database
    const created = await product.save();
    // Respond with the created product
    res.status(201).json(created);
  } catch (error) {
    // Log and handle errors
    console.error('Create Product Error:', error.message);
    res.status(500).json({
      message: 'Server error while creating product',
      error: error.message,
    });
  }
};

// Create many products at once (bulk insert)
export const createManyProducts = async (req, res) => {
  try {
    // Get products array from request body
    const products = req.body.products;
    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }
    // Insert all products into the database
    const createdProducts = await Product.insertMany(products);
    // Respond with the created products
    res.status(201).json({
      message: 'Products successfully created',
      data: createdProducts,
    });
  } catch (error) {
    // Log and handle errors
    console.error('Create Many Products Error:', error.message);
    res.status(400).json({
      message: 'Invalid Products Data',
      error: error.message,
    });
  }
};

// Create product reviews
export const createProductReviews = async (req, res) => {
  // Destructure rating and comment from request body
  const { rating, comment } = req.body;

  // Validate input
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  try {
    // Find the product to review by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    // Build the review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Add the review to the product's reviews array
    product.reviews.push(review);
    // Update the number of reviews
    product.numReviews = product.reviews.length;
    // Calculate the new average rating
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) / product.numReviews;

    // Save the updated product
    await product.save();
    // Respond with the new review
    res.status(201).json({ message: 'Review Created', review });
  } catch (error) {
    // Log and handle errors
    console.error('Create Review Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    // Find and update the product by ID with new data
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (updated) {
      // Respond with the updated product
      res.status(200).json(updated);
    } else {
      // If not found, return 404
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    // Log and handle errors
    console.error('Update Product Error:', error.message);
    res.status(400).json({ message: 'Update Failed', error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete the product from the database
      await Product.deleteOne({ _id: req.params.id });
      // Respond with success message
      res.status(200).json({ message: 'Product Removed' });
    } else {
      // If not found, return 404
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    // Log and handle errors
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete many products by IDs
export const deleteManyProducts = async (req, res) => {
  try {
    // Get array of product IDs from request body
    const { ids } = req.body;
    // Delete all products with those IDs
    const result = await Product.deleteMany({ _id: { $in: ids } });
    // Respond with the number of deleted products
    res
      .status(200)
      .json({ message: `${result.deletedCount} products deleted` });
  } catch (error) {
    // Log and handle errors
    console.error('Delete Many Products Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};