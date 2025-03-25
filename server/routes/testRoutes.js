import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/addUser", async (req, res) => {
  try {
    const user = new User({
      username: "testUser",
      email: "test@example.com",
      password: "123456",
    });

    await user.save();
    res.status(201).json({ message: "User added successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error: error.message });
  }
});

export default router;
