import Cart from "../model/cart.model.js";
import Order from "../model/order.model.js";

export const placeOrder = async (req, res) => {
  const { fromDate, toDate } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      userId,
      products: cart.products,
      fromDate,
      toDate,
      totalAmount: cart.products.reduce((sum, item) => sum + item.productId.price, 0),
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed. Proceed to payment.",
      orderId: newOrder._id
    });
  } catch (error) {
    res.status(500).json({ message: "Order placement failed", error });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId })
      .populate("products.productId", "name size imageUrl categoryName")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No booking found for this user." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching user booking:", err);
    res.status(500).json({ error: "Error fetching user booking." });
  }
};

export const getOrderHistory = async (req, res) => {
  const userId = req.userId;

  try {
    const orders = await Order.find({ userId })
      .populate("products.productId", "name price image categoryName") // Make sure 'image' is included
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No booking found for this user." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(" Error in getOrderHistory:", err.message);
    res.status(500).json({ error: "Error fetching booking history" });
  }
};

export const savePaidOrder = async (req, res) => {
  const { paymentId, razorpayOrderId, fromDate, toDate, amount } = req.body;
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      userId,
      products: cart.products.map((p) => ({ productId: p.productId })),
      fromDate,
      toDate,
      paymentId,
      razorpayOrderId,
      amount,
      status: "Paid",
    });

    await order.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ success: true, message: "Order placed after payment!", order });
  } catch (error) {
    console.error("savePaidOrder error:", error);
    res.status(500).json({ success: false, error: "Order save failed after payment" });
  }
};
export const checkReviewEligibility = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;

  try {
    const orders = await Order.find({ userId });

    const hasOrdered = orders.some(order =>
      order.products.some(p => p.productId.toString() === productId)
    );

    res.json({ isEligible: hasOrdered });
  } catch (err) {
    console.error(" Error checking review eligibility:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;


    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    await Order.deleteOne({ _id: orderId });

    return res.json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({ message: "Server error while cancelling order." });
  }
};


