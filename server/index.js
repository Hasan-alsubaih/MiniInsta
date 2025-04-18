import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://mini-instaclient.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

async function DBConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB".green);
  } catch (error) {
    console.log(" MongoDB connection failed:".bgRed, error.message);
  }
}

app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`.bgGreen);
});

(async function () {
  await DBConnection();
})();

export default app;
