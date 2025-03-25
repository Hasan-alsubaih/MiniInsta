import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { token } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const links = token
    ? [
        { path: "/", label: "Home" },
        { path: "/profile", label: "Profile" },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
      ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InstagramIcon
            sx={{ color: "#E1306C", fontSize: 30, marginRight: 1 }}
          />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#E1306C",
              fontWeight: "bold",
            }}
          >
            MiniInsta
          </Typography>
        </Box>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {links.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              sx={{
                border: isActive(link.path)
                  ? "2px solid #E1306C"
                  : "1px solid #E1306C",
                backgroundColor: isActive(link.path)
                  ? "#E1306C"
                  : "transparent",
                color: isActive(link.path) ? "#fff" : "#E1306C",
                borderRadius: "20px",
                padding: "5px 20px",
                marginRight: 2,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: "block", sm: "none" }, color: "#E1306C" }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List sx={{ width: 250 }}>
            {links.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={toggleDrawer(false)}
                  sx={{ color: "#E1306C" }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
