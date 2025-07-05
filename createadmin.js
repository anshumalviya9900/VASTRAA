// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { User } from "./model/user.model.js"; 


mongoose.connect(process.env.MONGO_URL2)
  .then(async () => {
    const hashedPassword = bcrypt.hashSync("Admin@123", 12);

    const result = await User.create({
      name: "Admin",
      email: "amalviya0088@gmail.com",
      password: hashedPassword,
      role: "admin",
      verified: true
    });

    console.log("Admin created:", result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error:", err);
  });
