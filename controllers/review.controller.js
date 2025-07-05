import { Review } from "../model/review.model.js";
import Order from "../model/order.model.js";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;

    if (!productId || !rating || !reviewText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pid = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : null;

    if (!pid) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const hasOrdered = await Order.findOne({
      userId: req.user._id,
      "products.productId": pid,
    });

    if (!hasOrdered) {
      return res.status(403).json({
        error: "Only users who ordered this product can leave a review.",
      });
    }

    const review = new Review({
      productId: pid,
      rating,
      reviewText,
      reviewImage: req.file?.path?.replace(/\\/g, "/"),
      userId: req.user._id,
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;


  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {

    const pid = new mongoose.Types.ObjectId(productId);

    const reviews = await Review.find({ productId: pid })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    res.json({ reviews });
  } catch (err) {
    console.error(" Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized: Not your review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting review" });
  }
};

export const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    const pid = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : null;

    if (!pid) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const hasOrdered = await Order.findOne({
      userId: req.user._id,
      "products.productId": pid,
    });

    res.json({ eligible: !!hasOrdered });
  } catch (err) {
    console.error("Eligibility check error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
