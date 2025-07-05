import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../model/payment.model.js';
import Order from '../model/order.model.js';
import Cart from '../model/cart.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

import mongoose from "mongoose";
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId;

    if (!amount || !userId) {
      return res.status(400).json({ message: "Amount and user ID are required" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });


    res.status(200).json({ order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = generatedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'paid',
        }
      );

      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "confirmed";
    await order.save();

    await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });

    res.status(200).json({ message: "Payment successful. Order confirmed." });
  } catch (error) {
    console.error(" Payment confirmation failed", error);
    res.status(500).json({ message: "Payment confirmation failed", error });
  }
};
