import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  size: String,
  image: [String],
  type: {
    type: String,
    enum: ["rental", "donation"],
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  description: String,
  isApproved: {
    type: Boolean,
    default: function () {
      return this.type === "rental";
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.type === "donation";
    },
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
