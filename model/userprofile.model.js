import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,

    },
    gender: {
      type: String,
      default: ''

    },
    address: {
      type: String,
      default: ''

    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilepicture: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const userProfile = mongoose.model("userprofile", userProfileSchema);