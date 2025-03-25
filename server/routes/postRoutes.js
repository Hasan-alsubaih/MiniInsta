import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  addNewComment,
  deleteComment,
  deletePost,
  toggleLikePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/createPost", protect, upload.single("image"), createPost);
router.get("/all", getPosts);
router.get("/post/:id", getPostById);
router.post("/:postId/addComment", protect, addNewComment);
router.delete("/:postId/deleteComment/:commentId", protect, deleteComment);
router.delete("/:postId/delete", protect, deletePost);
router.post("/:postId/toggleLike", protect, toggleLikePost);

export default router;
