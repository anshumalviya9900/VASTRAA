import express, { Router } from "express";
import { createOrder,paymentSuccess,verifyPayment} from "../controllers/payment.controller.js";
import auth from "../middleware/auth.js"
const router = express.Router();

router.post("/create-order", auth,createOrder);
router.post('/verify-payment',auth, verifyPayment);
router.post("/payment-success",auth,paymentSuccess);
export default router;
