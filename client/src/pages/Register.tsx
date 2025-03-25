import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setOpenSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, email, password }),
});


      const data = await res.json();

      if (res.ok) {
        setOpenSnackbar({
          open: true,
          message: "Account created successfully! Please log in.",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setOpenSnackbar({
          open: true,
          message: data.message || "Registration failed",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setOpenSnackbar({
        open: true,
        message: "Registration failed, please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>

          <Box textAlign="center" sx={{ marginTop: 2 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                underline="hover"
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar.open}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
        >
          <Alert
            onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
            severity={openSnackbar.severity as "success" | "error"}
          >
            {openSnackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Register;
