import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import './ResponsiveDrawer.css';

import AppBar from './AppBar';
import NavBar from './NavBar';

const drawerWidth = 200;

// This file was shamelessly adapted from
// https://mui.com/material-ui/react-drawer/#responsive-drawer

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen, setMobileOpen]);

  return (
    <Box display="flex">
      <AppBar {...{ drawerWidth, handleDrawerToggle }} />
      <NavBar {...{ drawerWidth, handleDrawerToggle, mobileOpen }} />

      {/* main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 1, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar id="toolbar-spacer">
          {/* Empty space to shift the content down below the AppBar */}
        </Toolbar>
        <Outlet />
      </Box>
    </Box>
  );
}
