import Product from '../models/productModel.js';
import seedProducts from '../data/products.js';

// @desc    Fetch all products with pagination, search, category, price range, brand, and rating filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    // Build query filter
    const query = {};

    // Keyword Search (on name or description)
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Category Filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Brand Filter
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Price Filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Rating Filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    let count = 0;
    let products = [];
    let categories = [];
    let brands = [];

    try {
      count = await Product.countDocuments(query);
      if (count > 0) {
        products = await Product.find(query)
          .limit(pageSize)
          .skip(pageSize * (page - 1))
          .sort({ createdAt: -1 });
        
        categories = await Product.distinct('category');
        brands = await Product.distinct('brand');
      }
    } catch (dbError) {
      console.warn('MongoDB query warning, using static local products list fallback:', dbError.message);
    }

    // Fallback if DB is disconnected, offline, empty, or returns nothing
    if (products.length === 0) {
      let filtered = [...seedProducts];

      // Keyword search
      if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, 'i');
        filtered = filtered.filter(
          (p) => regex.test(p.name) || regex.test(p.description)
        );
      }

      // Category filter
      if (req.query.category && req.query.category !== 'All') {
        filtered = filtered.filter((p) => p.category === req.query.category);
      }

      // Brand filter
      if (req.query.brand) {
        filtered = filtered.filter((p) => p.brand === req.query.brand);
      }

      // Price filters
      if (req.query.minPrice) {
        filtered = filtered.filter((p) => p.price >= Number(req.query.minPrice));
      }
      if (req.query.maxPrice) {
        filtered = filtered.filter((p) => p.price <= Number(req.query.maxPrice));
      }

      // Rating filters
      if (req.query.rating) {
        filtered = filtered.filter((p) => p.rating >= Number(req.query.rating));
      }

      count = filtered.length;
      categories = [...new Set(seedProducts.map((p) => p.category))];
      brands = [...new Set(seedProducts.map((p) => p.brand))];

      const startIdx = pageSize * (page - 1);
      products = filtered.slice(startIdx, startIdx + pageSize);
    }

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalProducts: count,
      categories,
      brands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (dbError) {
      console.warn('MongoDB findById warning, checking static fallback list:', dbError.message);
    }

    if (!product) {
      product = seedProducts.find((p) => p._id === req.params.id);
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = new Product({
      name: name || 'Sample Name',
      price: price || 0,
      user: req.user._id,
      image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      brand: brand || 'Sample Brand',
      category: category || 'Sample Category',
      countInStock: countInStock || 0,
      numReviews: 0,
      description: description || 'Sample Description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        return next(new Error('Product already reviewed'));
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
