import { ThemeOptions, createTheme } from '@mui/material/styles';

import { typography } from './typography';

export const themeOptions: ThemeOptions = {
  // Generate this palette with https://zenoo.github.io/mui-theme-creator/
  palette: {
    mode: 'dark',
    primary: {
      main: '#79de0d',
    },
    secondary: {
      // main: '#d584e7', // purpley
      main: '#7067cf', // slate blue
    },
    background: {
      default: '#111111',
      paper: '#212121',
    },
  },
  typography,
};

export const theme = createTheme(themeOptions);
