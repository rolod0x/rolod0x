import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import Rolod0xText from '@src/components/Rolod0xText';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function SettingsAppBar({ drawerWidth, handleDrawerToggle }: Props) {
  const { themeName, toggleTheme } = useContext(ThemeNameContext);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        color: 'toolbar.text',
        bgcolor: 'toolbar.background',
      }}>
      <Toolbar
        sx={{
          justifyContent: 'flex-start',
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
          <Rolod0xText bold /> settings
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {themeName === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
