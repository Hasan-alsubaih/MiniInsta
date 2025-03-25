import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser, token, setToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!user);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setUsername(data.username);
          setEmail(data.email);
        } else {
          console.error("Error fetching profile:", data.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchProfile();
  }, [token, user, navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setUser(data);
        setIsEditing(false);
        setPreviewImage(null);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to update profile.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while updating the profile.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress sx={{ display: "block", margin: "20% auto" }} />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" textAlign="center" sx={{ marginTop: 4 }}>
          No profile data found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Box>
          <Avatar
            src={
              previewImage ||
              user.profilePic ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            sx={{ width: 100, height: 100, margin: "0 auto", marginBottom: 2 }}
          />
          {isEditing && (
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ marginBottom: "10px" }}
              />
            </Box>
          )}
        </Box>

        {isEditing ? (
          <>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleProfileUpdate}
              sx={{ marginTop: 2 }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body1" color="textSecondary">
              {user.email}
            </Typography>
          </>
        )}

        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Typography variant="h6">{user.followers?.length || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Followers
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{user.following?.length || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Following
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as "success" | "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
