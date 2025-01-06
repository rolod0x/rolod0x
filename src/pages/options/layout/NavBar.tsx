import { Box, Drawer } from '@mui/material';

import OptionsDrawer from './OptionsDrawer';

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

export default function NavBar({ drawerWidth, handleDrawerToggle, mobileOpen }: Props) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}>
        <OptionsDrawer />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open>
        <OptionsDrawer />
      </Drawer>
    </Box>
  );
}
