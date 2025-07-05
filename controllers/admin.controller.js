import Dress from "../model/dress.model.js";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin login success",
      role: admin.role,
      name: admin.name,
    });

  } catch (err) {
    console.error(" Admin Sign-in Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingDonations = async (req, res) => {
  try {
    const pendingProducts = await Dress.find({ type: "donation", isApproved: false });
    res.status(200).json({ pendingProducts });
  } catch (err) {
    res.status(500).json({ error: "Error fetching pending donations" });
  }
};

export const approveDonation = async (req, res) => {
  try {
    const productId = req.params.id;

    const userId = req.userId;
    const userRole = req.userRole;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    const product = await Dress.findOne({
      _id: productId,
      type: "donation",
      isApproved: false,
    });

    if (!product) {
      return res.status(404).json({ error: "Donation not found or already approved" });
    }

    product.isApproved = true;
    await product.save();

    res.status(200).json({ message: "Donation approved successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error approving donation" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(" Logout Error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
