import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import { typography } from './typography';
import { lightPaletteOptions, darkPaletteOptions } from './palette';

const common = {
  typography,
};

export const themes = {
  light: responsiveFontSizes(createTheme({ palette: lightPaletteOptions, ...common })),
  dark: responsiveFontSizes(createTheme({ palette: darkPaletteOptions, ...common })),
};

export type ThemeName = keyof typeof themes;
