import express from "express";
import { addToCart, getUserCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addToCart);
router.get("/user-cart", auth, getUserCart);
router.delete("/remove/:productId", auth, removeFromCart);
router.delete("/clear", auth, clearCart);

export default router;
