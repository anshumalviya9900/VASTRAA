import express from "express";
import { verifyOtp } from "../controllers/user.controller.js";
import { signInAction, signUpAction, verifyAccount, googleSignInAction, getLoggedInUser, verifyEmail, userLogout } from "../controllers/user.controller.js";
import { body } from "express-validator";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/sign-up",
  body("name", "username is required").notEmpty(),
  body("email", "email is required").notEmpty(),
  body("password", "password is required").notEmpty(),
  body('password').isLength({ min: 6 }),
  signUpAction);

router.post("/sign-in", signInAction);
router.get("/verify/:token", verifyEmail);
router.post("/google-login", googleSignInAction);
router.post("/verify", verifyAccount);
router.post('/verify-otp', verifyOtp);
router.post("/logout", auth, userLogout);
router.get("/current-user", auth, getLoggedInUser);

export default router;

