import express from "express";
import auth from "../middleware/auth.js";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/add", auth, addToWishlist);
router.get("/user-wishlist", auth, getUserWishlist);
router.delete("/remove/:productId", auth, removeFromWishlist);

export default router;
