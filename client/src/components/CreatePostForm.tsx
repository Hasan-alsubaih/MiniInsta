import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({
  onPostCreated,
}: {
  onPostCreated: (newPost: any) => void;
}) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePostSubmit = async () => {
    if (!caption || !image) {
      alert(" Please add a caption and upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/createPost`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      const data = await res.json();

      if (res.ok) {
        setCaption("");
        setImage(null);
        onPostCreated(data.post);
        setOpenSnackbar(true);
      } else {
        alert(`${data.message || "Failed to create post."}`);
      }
    } catch (error) {
      alert(" Error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, marginBottom: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Avatar
          src={user?.profilePic || "/images/defaultProfile.jpg"}
          alt="Profile"
          sx={{ width: 40, height: 40, marginRight: 2 }}
        />
        <Typography variant="h6">
          {user?.username || "Unknown Person"}
        </Typography>
      </Box>

      <TextField
        label="Write a caption..."
        fullWidth
        multiline
        rows={3}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: "10px" }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handlePostSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Post"}
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Post created successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreatePost;
