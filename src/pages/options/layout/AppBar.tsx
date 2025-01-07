import { useContext } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

import Rolod0xText from '@src/components/Rolod0xText';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';
import { usePageTitle } from '@src/shared/contexts/PageTitleContext';

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function SettingsAppBar({ drawerWidth, handleDrawerToggle }: Props) {
  const { themeName, toggleTheme } = useContext(ThemeNameContext);
  const { pageTitle } = usePageTitle();

  const getPageTitle = () => {
    if (!pageTitle) {
      return 'settings';
    }

    if (typeof pageTitle === 'string') {
      return (
        <>
          <Rolod0xText bold /> {pageTitle}
        </>
      );
    }

    return pageTitle;
  };

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
          {getPageTitle()}
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {themeName === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
