import { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import CreatePost from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

interface Post {
  _id: string;
  user: { username: string; profilePic: string };
  image: string;
  caption: string;
  likes: string[];
  comments: Array<{ _id: string; user: { username: string }; text: string }>;
  createdAt: string;
}

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/all`);
      const data = await res.json();
      console.log("Posts Data:", data);
      const formattedPosts = data
        .map((post: any) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes : [],
          comments: Array.isArray(post.comments) ? post.comments : [],
          createdAt:
            post.createdAt && !isNaN(Date.parse(post.createdAt))
              ? post.createdAt
              : new Date().toISOString(),
        }))
        .sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  const handleDeletePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/delete`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});

      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        alert("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setShowCreatePost(!showCreatePost)}
        sx={{ marginBottom: 2 }}
      >
        +
      </Button>

      {showCreatePost && <CreatePost onPostCreated={handlePostCreated} />}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20% auto" }} />
      ) : posts.length === 0 ? (
        <Typography variant="body1" align="center">
          No posts available.
        </Typography>
      ) : (
        <Box>
          {posts.map((post) => (
            <Box key={post._id} sx={{ marginBottom: 3 }}>
              <PostCard
                id={post._id}
                username={post.user.username}
                userImage={post.user.profilePic || "/images/defaultProfile.jpg"}
                postImage={post.image}
                caption={post.caption}
                likes={post.likes}
                comments={post.comments}
                createdAt={post.createdAt}
                onDelete={() => handleDeletePost(post._id)}
                isFavorite={post.likes.includes(user?.id!) ? true : false}
                fetchPosts={fetchPosts}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;
