import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "miniInstagram",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const fileFilter = (req, file, cb) => {
  console.log("req.body :>> ", req.body);
  console.log("req.file :>> ", file);


  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    console.log("file accepted");
    cb(null, true);
  } else {
    console.log("file rejected");
    
    cb(new Error("Only JPG and PNG files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
