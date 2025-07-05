import mongoose from "mongoose";

const dressSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: [String],
  isApproved: { type: Boolean, default: false },
  type: { type: String, default: "donation" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Dress = mongoose.model("Dress", dressSchema);
export default Dress;
