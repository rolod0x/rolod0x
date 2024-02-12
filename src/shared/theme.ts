import { createTheme } from '@mui/material/styles';

import { typography } from './typography';
import { lightPaletteOptions, darkPaletteOptions } from './palette';

const common = {
  typography,
};

export const themes = {
  light: createTheme({ palette: lightPaletteOptions, ...common }),
  dark: createTheme({ palette: darkPaletteOptions, ...common }),
};

export type ThemeName = keyof typeof themes;
