import Product from "../model/product.model.js";
import Category from "../model/category.model.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    console.log("body", req.body);
    console.log("FILES:", req.files);

    const { name, price, size, description } = req.body;
    const categoryName = req.body.categoryName?.trim();
    const imagePaths = req.files.map(file => file.path);

    if (!imagePaths || imagePaths.length === 0) {
      return res.status(400).json({ error: "No image files uploaded!" });
    }

    let newProduct = new Product({
      name,
      price,
      size,
      description,
      image: imagePaths,
      type: "rental",
      categoryName,
      isApproved: true
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-userId -isApproved');
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-userId -isApproved'); // Exclude fields
    res.status(200).json({ message: "Product updated", updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating product" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
export const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.find({ categoryName }, '-userId -isApproved');
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: "Error fetching products by category" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Product ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      console.log("No product found for ID");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(" Product found:", product);

    res.status(200).json({ product });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q?.trim();

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(searchQuery, "i");
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { categoryName: { $regex: regex } }
      ]
    }).select("-userId -isApproved");

    res.status(200).json({ products });
  } catch (err) {
    console.error(" Error during search:", err);
    res.status(500).json({ error: "Server error during search" });
  }
};
