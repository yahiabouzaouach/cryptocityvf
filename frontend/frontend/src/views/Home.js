import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TopNavbar from '../components/TopNavbar';
import SideNavbar from '../components/SideNavbar';
import routes from '../App'

const HomeContainer = styled('div')(({ theme, open }) => ({
  marginLeft: open ? '300px' : '200px',
  marginTop: '110px',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const Home = () => {
 
  const [open, setOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(routes[0].key); 
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSideBarItemClick = (item) => {
    setSelectedMenuItem(item);
  };

  return (
    <>
      <TopNavbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideNavbar open={open} handleDrawerClose={handleDrawerClose} onItemClick={handleSideBarItemClick} />
      <HomeContainer open={open}>
        {routes.map((route) => {
          if (route.key === selectedMenuItem) {
            return route.component;
          }
          return null;
        })}
      </HomeContainer>
    </>
  );
};

export default Home;
