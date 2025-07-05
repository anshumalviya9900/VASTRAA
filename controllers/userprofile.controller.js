import { userProfile } from "../model/userprofile.model.js";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, gender, address, email } = req.body || {};

    const profilepicture = req.file
      ? `/uploads/${req.file.filename}`
      : req.body?.profilepicture || "";

    console.log("Update Request Body:", req.body);
    console.log("Update File Info:", req.file || req.files);
    console.log("Received update data:", {
      userId,
      name,
      gender,
      address,
      email,
      profilepicture,
    });

    if (
      !userId ||
      !name?.trim() ||
      !gender?.trim() ||
      !address?.trim() ||
      !email?.trim()
    ) {
      return res.status(400).json({
        error: "All fields (name, gender, address, email) are required.",
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }


    const existingProfile = await userProfile.findOne({ userId });
    if (!existingProfile) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const updateData = {
      name,
      gender,
      address,
      email,
    };

    if (profilepicture) {
      updateData.profilepicture = profilepicture;
    }

    const updatedUser = await userProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "User profile updated successfully",
      updatedUser,
    });

  } catch (err) {
    console.error(" Update error:", err);
    return res.status(500).json({
      error: "Server error while updating user details",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("/fetch/me route hit");
    console.log("User from token:", userId);



    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const profile = await userProfile.findOne({ userId }).select("-__v");

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid or missing User ID from token" });
    }

    const deletedProfile = await userProfile.findOneAndDelete({ userId });

    if (!deletedProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
      deletedProfile,
    });

  } catch (err) {
    console.error("Error deleting user profile:", err);
    return res.status(500).json({ error: "Server error while deleting user profile" });
  }
};

export const saveUserDetails = async (req, res) => {
  try {
    const { name, gender, address, email } = req.body;
    const userId = req.userId;

    console.log(" Received userId:", userId);
    console.log(" req.body:", req.body);
    console.log(" req.file:", req.file);

    if (!userId) {
      console.error(" userId is missing. Token might be invalid or expired.");
      return res.status(401).json({ error: "Unauthorized. Please log in again." });
    }
    const profilepicture = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.profilepicture || "";

    if (
      !name?.trim() ||
      !gender?.trim() ||
      !address?.trim() ||
      !email?.trim() ||
      !profilepicture
    ) {
      return res.status(400).json({
        error: "All fields are required (name, gender, address, email, profilepicture).",
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const existing = await userProfile.findOne({ userId });
    if (existing) {
      return res.status(409).json({ error: "User details already submitted." });
    }

    const userInfo = await userProfile.create({
      userId,
      name,
      gender,
      address,
      email,
      profilepicture,
    });

    console.log(" Profile created successfully:", userInfo);

    return res.status(201).json({ message: "User details saved", userInfo });
  } catch (err) {
    console.error(" ERROR in saveUserDetails:", err);
    return res
      .status(500)
      .json({ error: "Server error while saving user details" });
  }
};
