const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, inStock } = req.body;

    // Validation
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = new Product({
      name,
      price: Number(price),
      categoryId,
      inStock: Boolean(inStock),
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { name, categoryId, inStock } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (categoryId) filter.categoryId = categoryId;
    if (inStock) filter.inStock = inStock === "true";

    const products = await Product.find(filter)
      .populate({
        path: "categoryId",
        select: "name -_id", // Only include name field, exclude _id
        transform: (doc) => (doc ? doc.name : null), // Transform to just return the name
      })
      .lean(); // Convert to plain JavaScript objects

    // Transform the response structure
    const transformedProducts = products.map((product) => ({
      ...product,
      category: product.categoryId, // categoryId now contains just the name
      categoryId: undefined, // Remove the original categoryId field
    }));

    res.json(transformedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
