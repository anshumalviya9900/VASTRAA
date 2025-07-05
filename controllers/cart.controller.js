import Cart from "../model/cart.model.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    console.log(" User ID:", userId);
    console.log(" Product ID:", productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const alreadyExists = cart.products.some(item =>
      item.productId.toString() === productId
    );

    if (!alreadyExists) {
      cart.products.push({ productId });
    }

    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });

  } catch (error) {
    console.error(" Add to cart error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(" Cart from DB:", cart.products);
    res.status(200).json(cart);
  } catch (err) {
    console.error(" Error fetching cart:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      item => !item.productId.equals(productId)
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error(" Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.updateOne({ userId }, { $set: { products: [] } });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
