import express from "express";
import { addReview, getReviewsByProduct ,deleteReview,checkReviewEligibility} from "../controllers/review.controller.js";
import  upload  from "../middlewares/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", upload.single("reviewImage"),auth, addReview);
router.get("/:productId", getReviewsByProduct);
router.delete("/delete/:id", auth, deleteReview); 
router.get("/is-eligible/:productId", auth, checkReviewEligibility);

export default router;
