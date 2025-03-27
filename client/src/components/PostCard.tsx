import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";

interface PostProps {
  id: string;
  isFavorite: boolean;
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
  likes: string[];
  comments: Array<{ _id: string; user: { username: string }; text: string }>;
  createdAt: string;
  onDelete: (postId: string) => void;
  fetchPosts: () => void;
}

const PostCard = ({
  id,
  username,
  userImage,
  postImage,
  caption,
  likes = [],
  comments = [],
  createdAt,
  onDelete,
  isFavorite,
  fetchPosts,
}: PostProps) => {
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState(comments);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLikePost = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/toggleLike`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok && data.post) {
        fetchPosts();
      } else {
        alert(data.message || "Failed to toggle like.");
      }
    } catch (error) {
      alert("Error occurred while liking the post.");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/addComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newComment = data.post.comments[data.post.comments.length - 1];
        setPostComments([newComment, ...postComments]);
        setCommentText("");
      } else {
        alert(data.message || "Failed to add comment.");
      }
    } catch (error) {
      alert("Error occurred while adding the comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/deleteComment/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPostComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      } else {
        alert(data.message || "Failed to delete comment.");
      }
    } catch {
      alert("Error deleting comment.");
    }
  };

  return (
    <Card>
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Avatar src={userImage || "/images/defaultProfile.jpg"} />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {username}
        </Typography>
        <IconButton onClick={handleMenuOpen} sx={{ marginLeft: "auto" }}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              onDelete(id);
              handleMenuClose();
            }}
          >
            Delete Post
          </MenuItem>
        </Menu>
      </Box>

      <CardMedia
        component="img"
        height="350"
        image={postImage}
        sx={{ borderRadius: 2 }}
      />

      <CardContent>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {caption}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, marginBottom: 1 }}>
          <IconButton
            color={isFavorite ? "error" : "default"}
            onClick={handleLikePost}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <FavoriteIcon />
            <Typography variant="body2">{likes.length}</Typography>
          </IconButton>
          <IconButton>
            <ChatBubbleOutlineIcon sx={{ color: "gray" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
          <TextField
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            label="Add a comment"
            fullWidth
            size="small"
          />
          <Button variant="contained" onClick={handleAddComment}>
            Comment
          </Button>
        </Box>

        <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

        <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
          {postComments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "gray", fontStyle: "italic" }}
            >
              No comments yet.
            </Typography>
          ) : (
            postComments.map((comment) => (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  <b>{comment.user.username}:</b> {comment.text}
                </Typography>
                <IconButton onClick={() => handleDeleteComment(comment._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{ display: "block", marginTop: 2, color: "gray" }}
        >
          {`Posted on ${new Date(createdAt).toLocaleDateString("en-GB")} at ${new Date(
            createdAt
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
