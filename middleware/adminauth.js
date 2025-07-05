import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.cookies.token;
console.log("🧾 Token in cookie:", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied - Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default adminAuth;
