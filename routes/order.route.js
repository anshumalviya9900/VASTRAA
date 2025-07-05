import express from "express";
import { placeOrder, getUserOrders, getOrderHistory, savePaidOrder, checkReviewEligibility, cancelOrder } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/place", auth, placeOrder);
router.get("/:userId", auth, getUserOrders);
router.get("/history", auth, getOrderHistory);
router.post("/paid", auth, savePaidOrder);
router.get("/check-eligibility/:productId", auth, checkReviewEligibility);
router.delete("/cancel/:id", auth, cancelOrder);

export default router;
