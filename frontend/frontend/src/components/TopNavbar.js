import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 240;
const role = localStorage.getItem("role");

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Topbar = ({ open, handleDrawerOpen }) => {
  const dispatch = useDispatch();
  const { userByID, loading } = useSelector((state) => ({ ...state.user }));
  const location = useLocation();
  const { accountId } = location.state || {};

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <AppBar position="fixed" open={open} sx={{ backgroundColor: " #000000" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        {!loading && userByID.user && (
          <Typography variant="h6" noWrap component="div">
            {role !== "employee" ? (
              <p>Dashboard Admin</p>
            ) : (
              <p>
                Hello {userByID.user.prenom.charAt(0).toUpperCase() + userByID.user.prenom.slice(1)}{" "}
                {userByID.user.nom.charAt(0).toUpperCase() + userByID.user.nom.slice(1)}!
              </p>
            )}
          </Typography>
        )}
        <div style={{ flexGrow: 7 }} />
        {accountId && (
          <Typography variant="body1" noWrap component="div">
            Account ID: {accountId}
          </Typography>
        )}
        <div style={{ width: 4 }} />
        <IconButton color="inherit" onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
        <Typography variant="body1" noWrap component="div">
          Logout
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
