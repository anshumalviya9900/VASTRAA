import express from "express";
import {getAllProducts,getProductsByCategory,getProductById, searchProducts} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/all", getAllProducts); 
router.get("/category/:categoryName", getProductsByCategory);
router.get("/product/:id", getProductById);
router.get("/search",searchProducts);

export default router;
