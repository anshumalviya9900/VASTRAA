import express from "express";
import { adminSignIn, approveDonation } from "../controllers/admin.controller.js";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductsByCategory, getProductById } from "../controllers/product.controller.js";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";
import { getPendingDonations } from "../controllers/admin.controller.js";
import upload from "../middlewares/upload.js";
import { adminLogout } from "../controllers/admin.controller.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/addproduct', adminAuth, upload.array('images', 5), createProduct);
router.post("/sign-in", adminSignIn);
router.get("/check-auth", adminAuth, (req, res) =>
  res.json({ role: req.user.role })
);
router.get("/allproducts", adminAuth, getAllProducts);
router.put("/approve-donation/:id", adminAuth, approveDonation);
router.put("/update-product/:id", adminAuth, updateProduct);
router.delete("/delete-product/:id", adminAuth, deleteProduct);
router.get("/pending-donations", adminAuth, getPendingDonations);
router.post("/addcategory", adminAuth, createCategory);
router.get("/allcategory", adminAuth, getAllCategories);
router.put("/update-category/:id", adminAuth, updateCategory);
router.delete("/delete-category/:id", adminAuth, deleteCategory);
router.post("/logout", adminAuth, adminLogout);

router.get("/category/:categoryName", adminAuth, getProductsByCategory);
router.get("/product/:id", adminAuth, getProductById);

export default router;
