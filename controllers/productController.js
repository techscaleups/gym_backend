const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// Helper: Save base64 image to uploads folder (sync version)
// You can switch to async fs.promises.writeFile for production
const saveBase64Image = (base64String, productName) => {
  const matches = base64String.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }

  const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const filename = `${productName}_${Date.now()}.${extension}`;
  const filepath = path.join(__dirname, '..', 'uploads', filename);

  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
};

// POST: Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      sizes,
      colors,
      rating,
      featured,
      images,
      isHotPick = false,
      quantity = 1,
      reviews = [],
    } = req.body;

    const slug = slugify(name, { lower: true });
    const savedImages = images?.map((img) => saveBase64Image(img, name)) || [];

    const product = new Product({
      name,
      slug,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      sizes,
      colors,
      images: savedImages,
      rating,
      featured,
      isHotPick,
      quantity,
      reviews,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET: All products
// GET: Filtered and searched products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      query, // search keyword
    } = req.query;

    const filter = {};

    // Category filter - supports multiple values
    if (category) {
      const categories = Array.isArray(category)
        ? category
        : typeof category === 'string'
        ? [category]
        : [];
      if (categories.length > 0) {
        filter.category = { $in: categories };
      }
    }

    // Brand filter - supports multiple values
    if (brand) {
      const brands = Array.isArray(brand)
        ? brand
        : typeof brand === 'string'
        ? [brand]
        : [];
      if (brands.length > 0) {
        filter.brand = { $in: brands };
      }
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Keyword search by product name
    if (query && query.trim() !== '') {
      filter.name = { $regex: query.trim(), $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      details: error.message,
    });
  }
};


// GET: Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};

// GET: Product by Slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product by slug', details: error.message });
  }
};

// PUT: Update product by slug
exports.updateProduct = async (req, res) => {
  try {
    const updatedFields = req.body;

    // If you support file uploads via middleware like multer, handle images here
    if (req.files && req.files.length > 0) {
      updatedFields.images = req.files.map(file =>
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
    }

    // Update slug if name changes
    if (updatedFields.name) {
      updatedFields.slug = slugify(updatedFields.name, { lower: true });
    }

    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};

// DELETE: Product by slug
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

// GET: Featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ featured: true });
    res.status(200).json(featured);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products', details: error.message });
  }
};

// GET: Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await Product.find({
      name: { $regex: query, $options: 'i' }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

// POST: Add new product as hot pick
exports.addHotPickProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      isHotPick: true,
    });

    await product.save();
    res.status(201).json({ message: 'Hot pick product added', product });
  } catch (err) {
    res.status(400).json({ message: 'Error adding hot pick product', error: err.message });
  }
};

// PUT: Mark existing product as hot pick
exports.markAsHotPick = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndUpdate(id, { isHotPick: true }, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product marked as hot pick', product });
  } catch (err) {
    res.status(500).json({ message: 'Error marking hot pick', error: err.message });
  }
};

// GET: Hot pick products
exports.getHotPickProducts = async (req, res) => {
  try {
    const hotPicks = await Product.find({ isHotPick: true });
    res.status(200).json(hotPicks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hot pick products', error: err.message });
  }
};exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { user, comment, rating } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = { user, comment, rating };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: 'Review added successfully', reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// POST: Add review to a product
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, comment, rating } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = { user, comment, rating };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: 'Review added', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
};


// GET: Get all reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error });
  }
};
