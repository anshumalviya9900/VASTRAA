import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import { userProfile } from "../model/userprofile.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const verifyAccount = async (request, response, next) => {
  try {
    let email = request.body.email?.trim().toLowerCase();
    console.log("Verifying email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return response.status(200).json({ message: "User already verified" });
    }

    await User.updateOne({ email }, { $set: { verified: true } });

    return response.status(201).json({ message: "Account verified successfully" });

  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: "Invalid token" });

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    return res.redirect("http://localhost:3000/sign-in");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const googleSignInAction = async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        role: "user",
        verified: true,
        googleSignIn: true,
        password: "",
      });
      await user.save();
    }


    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Google Sign-in Success",
      user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signInAction = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user)
      return response.status(401).json({ error: "Unauthorized user | Email ID not found" });


    if (user.role === "user" && !user.verified)
      return response.status(401).json({ error: "Not verified user | Please verify your account via OTP first" });

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return response.status(401).json({ error: "Unauthorized user | Invalid password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    response.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    return response.status(200).json({ message: "Sign In Success", user });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUpAction = async (request, response) => {
  try {
    const error = validationResult(request);
    if (!error.isEmpty()) {
      return response.status(401).json({
        error: "Bad request | Invalid data",
        errorDetails: error.array()
      });
    }

    let { password, email, name } = request.body;


    const saltKey = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, saltKey);


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);


    const emailStatus = await sendOTP(email, otp);
    if (!emailStatus) {
      return response.status(500).json({ error: "Failed to send OTP email" });
    }

    const already = await User.findOne({ email });
    if (already) return response.status(409).json({ error: "Email already registered" });


    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verified: false,
      otp,
      otpExpiresAt
    });

    await userProfile.create({
      userId: newUser._id,
      name,
      email,
    });


    return response.status(201).json({
      message: "User created. OTP sent to email",
      userDetail: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("❌ signUpAction Error:", err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const sendOTP = (toEmail, otp) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: toEmail,
      subject: 'OTP Verification - Hobby Buddy',
      html: `
        <h3>Your OTP is: <span style="color:blue;">${otp}</span></h3>
        <p>This OTP is valid for 2 minutes only.</p>
        <p>If you did not request this, please ignore this email.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.verified) return res.status(400).json({ message: "Already verified" });

  const currentTime = new Date();

  if (user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (user.otpExpiresAt < currentTime)
    return res.status(400).json({ message: "OTP expired" });

  user.verified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.status(200).json({ message: "User verified successfully" });
};
export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
});
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(" Logout Error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
export const getLoggedInUser = async (req, res) => {
  try {
    const { name, email, role } = req.user;
    res.status(200).json({ name, email ,role});
  } catch (err) {
    console.error(" Error in getLoggedInUser:", err.message);
    res.status(500).json({ error: "Server error fetching user data" });
  }
};
