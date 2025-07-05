import express from "express";
import upload from "../middlewares/upload.js";
import { donateDress, getUserDonations, getAllDonation } from "../controllers/dress.controller.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminauth.js";

const router = express.Router();

router.post("/donate", auth, upload.array("images", 5), donateDress);
router.get("/my-donations", auth, getUserDonations);
router.get("/all-donations",adminAuth, getAllDonation);

export default router;
