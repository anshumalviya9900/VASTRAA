import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const auth = async (req, res, next) => {
  try {
    console.log("Cookie Received:", req.cookies);

    const token = req.cookies?.token;
    if (!token) {
      console.log(" No token found");
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    console.log("Finding User with ID:", decoded.userId);
    req.userId = decoded.userId;

    const user = await User.findById(decoded.userId).select("-password");
    console.log("Found User:", user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
export default auth;