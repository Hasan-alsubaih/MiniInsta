import cloudinary from "../config/cloudinary.js";
import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;

    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    if (!caption || !file) {
      return res
        .status(400)
        .json({ message: "Image and caption are required." });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "miniInstagram",
    });

    const newPost = await Post.create({
      user: req.user._id,
      image: result.secure_url,
      caption,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });

    const filteredPosts = posts.filter((post) => post.user !== null);

    res.status(200).json(filteredPosts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username email profilePic")
      .populate("comments.user", "username profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user?._id;

    const isLiked = userId ? post.likes.includes(userId.toString()) : false;

    res.status(200).json({
      post,
      isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

export const addNewComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!postId || !text) {
      return res
        .status(400)
        .json({ message: "Post ID and comment text are required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { user: req.user._id, text, createdAt: new Date() },
        },
      },
      { new: true }
    ).populate("comments.user", "username profilePic");

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Sorry, you can delete only your own comments.",
      });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.json({
      message: "Comment deleted successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own posts.",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post.", error: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized request: User ID missing" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    res.json({
      message: isLiked ? "Like removed" : "Post liked",
      isLiked: !isLiked,
      likesCount: updatedPost.likes.length,
      post: updatedPost,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling like", error: error.message });
  }
};
