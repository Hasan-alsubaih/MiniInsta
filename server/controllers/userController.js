import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔍 Received Data:", { email, password });

  try {
    const user = await User.findOne({ email });
    console.log("👤 Found User in DB:", user);

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(" Password Matched - Login Successful");

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || "/images/defaultProfile.jpg",
        token: generateToken(user._id),
      });
    } else {
      console.log(" Invalid email or password");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(" Error in Login Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    user ? res.json(user) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    if (id === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyFollowing = currentUser.following.includes(id);

    if (isAlreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (user) => user.toString() !== id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (user) => user.toString() !== currentUserId.toString()
      );

      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Unfollowed successfully!" });
    } else {
      currentUser.following.push(id);
      userToFollow.followers.push(currentUserId);

      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Followed successfully!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Please enter a search query." });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("username email profilePic");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching for users", error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate(
      "following",
      "username email profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.following);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching following list", error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate(
      "followers",
      "username email profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching followers list", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};
