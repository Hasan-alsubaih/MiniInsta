import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  followUser,
  searchUsers,
  getFollowing,
  getFollowers,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.put(
  "/updateProfile",
  protect,
  upload.single("profilePic"),
  updateProfile
);

router.post("/:id/follow", protect, followUser);

router.get("/search", searchUsers);

router.get("/:id/following", getFollowing);
router.get("/:id/followers", getFollowers);

export default router;
