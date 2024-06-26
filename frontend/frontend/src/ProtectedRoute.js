import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import SideNavbar from "./components/SideNavbar";

import TopNavbar from './components/TopNavbar';
import { styled } from '@mui/material/styles';


const HomeContainer = styled('div')(({ theme, open }) => ({
  marginLeft: open ? '300px' : '200px',
  marginTop: '110px',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));


const ProtectedRoute = ({  children }) => {
  const [open, setOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Tables"); 
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSideBarItemClick = (item) => {
    setSelectedMenuItem(item);
  };
  const { isAuthenticated } = useSelector((state) => state.auth);

  

  return (
    <>
    <TopNavbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <SideNavbar open={open} handleDrawerClose={handleDrawerClose} onItemClick={handleSideBarItemClick} />
    <HomeContainer open={open}>
      {children}
    </HomeContainer>

  </> )
};



export default ProtectedRoute;
