import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useGetCurrentUser } from "../hooks/auth.api";
import { stringAvatar } from "../utils/avatarColor";
import { useState } from "react";

export const Appbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <AppBar position="static" role="banner">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() => navigate({ to: "/" })}
          sx={{ padding: 0, textTransform: "none" }}
          aria-label="Navigate to home page"
        >
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Project Insights
          </Typography>
        </Button>
        {isAuthenticated && (
          <>
            {isLoading ? (
              <CircularProgress color="inherit" size={24} sx={{ mr: 2 }} />
            ) : data ? (
              <Stack
                gap={1}
                direction="row"
                alignItems="center"
                sx={{ ml: "auto" }}
              >
                <IconButton onClick={handleMenu} aria-label="Open user menu">
                  <Avatar
                    {...stringAvatar(`${data.FirstName} ${data.LastName}`)}
                  />
                </IconButton>
                <Stack>
                  <Typography>{`${data.FirstName} ${data.LastName}`}</Typography>
                  <Typography variant="caption">{data.Email}</Typography>
                </Stack>
              </Stack>
            ) : null}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              aria-label="User menu"
            >
              <MenuItem
                onClick={() => navigate({ to: "/users" })}
                aria-label="Navigate to users page"
              >
                Users
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                aria-label="Logout from application"
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
