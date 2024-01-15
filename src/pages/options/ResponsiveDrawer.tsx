import { useCallback, useState, ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import AddressesSettings from './AddressesSettings';
import DisplaySettings from './DisplaySettings';
import Donate from './Donate';
import SiteSettings from './SiteSettings';
import OptionsDrawer from './OptionsDrawer';

const drawerWidth = 200;

// This file was shamelessly adapted from
// https://mui.com/material-ui/react-drawer/#responsive-drawer

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setPage] = useState('Addresses');
  const theme = useTheme();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen, setMobileOpen]);

  const PageComponent = ({ page, children }: { page: string; children: ReactNode }) => (
    <Box style={{ display: currentPage !== page && 'none' }}>{children}</Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            rolod<span style={{ color: theme.palette.primary.main }}>0x</span> settings
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="rolod0x options">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}>
          <OptionsDrawer {...{ currentPage, setPage }} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open>
          <OptionsDrawer {...{ currentPage, setPage }} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <PageComponent page="Addresses">
          <AddressesSettings />
        </PageComponent>
        <PageComponent page="Display">
          <DisplaySettings />
        </PageComponent>
        <PageComponent page="Site">
          <SiteSettings />
        </PageComponent>
        <PageComponent page="Donate">
          <Donate />
        </PageComponent>
      </Box>
    </Box>
  );
}
