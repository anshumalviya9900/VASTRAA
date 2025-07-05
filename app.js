import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import dressRoutes from "./routes/dress.route.js";
import reviewRoutes from "./routes/review.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import paymentRouter from "./routes/payment.route.js";
import userProfile from "./routes/userprofile.route.js"
dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin:"http://localhost:3001",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());


mongoose.connect(process.env.MONGO_URL2)
  .then(() => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use("/user", userRouter);
    app.use("/products", productRouter);
    app.use("/cart", cartRouter);
    app.use("/order", orderRouter);
    app.use("/admin", adminRouter);
    app.use("/dress", dressRoutes);
    app.use("/wishlist", wishlistRoutes);
    app.use("/review", reviewRoutes);
    app.use("/payment", paymentRouter);
    app.use("/userprofile", userProfile);
    app.get("/", (req, res) => {
  res.send("API is working 👌");
});


    app.listen(process.env.PORT, () => {
      console.log("database connected..");
      console.log("server started...");
    });
  }).catch(err => {
    console.log("database connection failed...", err);
  })




