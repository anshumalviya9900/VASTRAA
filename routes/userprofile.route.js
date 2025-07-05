import express from "express";
import {saveUserDetails, updateUserDetails,getUserProfile,deleteUserProfile} from "../controllers/userprofile.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", auth, upload.single("profilepicture"), saveUserDetails);
router.post("/update",auth,upload.single("profilepicture"), updateUserDetails);
router.get("/fetch/me",auth,getUserProfile)
router.delete("/delete", auth, deleteUserProfile);

export default router;