import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(" Incoming Token:", authHeader);

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(" Decoded Token:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      console.log(" User Found:", user);

      if (!user) {
        console.log(" User not found in database");
        return res
          .status(401)
          .json({ message: "User not found. Please log in again." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(" Token Verification Error:", error);
      res.status(401).json({
        message: "Invalid token, please login again.",
        error: error.message,
      });
    }
  } else {
    console.log(" No token provided");
    res.status(401).json({ message: "No token, please login" });
  }
};
