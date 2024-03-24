import { alpha, darken, PaletteOptions, ThemeOptions, createTheme } from '@mui/material/styles';
import _ from 'lodash';

// Generate these palettes with https://zenoo.github.io/mui-theme-creator/

const _paletteOptions: PaletteOptions = {
  mode: 'dark',
  primary: {
    // main: '#79DE0D', // lawn green
    // main: lighten('#6C8BDA', 0.2), // blue-gray / cornflower
    main: '#517BE8', // royal blue
  },
  secondary: {
    // main: '#D584E7', // violet
    // main: '#7067CF', // slate blue
    // main: '#8DF2D4', // medium aquamarine / magic mint
    main: '#8DD9CC', // middle blue green
  },
  accent: {
    main: '#F4E174', // Jasmine
  },
  background: {
    default: '#111111', // smoky black
    paper: '#212121', // raisin black
  },
  text: {
    primary: '#FFFFFF',
  },
};

const _themeOptions: ThemeOptions = { palette: _paletteOptions };
const _theme = createTheme(_themeOptions);

/////////////////////////////////////////////////////////////////////////////
// Based colours are now defined, so we can derive further semantic color
// tokens from those.
/////////////////////////////////////////////////////////////////////////////

// We could also use a nested partial with the following trick from
// https://stackoverflow.com/a/47914631/179332
//
// type RecursivePartial<T> = {
//   [P in keyof T]?: RecursivePartial<T[P]>;
// };
//
// const _extraThemeOptions: RecursivePartial<ThemeOptions> = {
//   palette: {
//     ...
//   },
// };

const _extraPaletteOptions: Partial<PaletteOptions> = {
  selectedOption: {
    text: _theme.palette.primary.contrastText,
    background: darken(_theme.palette.secondary.dark, 0),
  },
  toolbar: {
    text: '#FFFFFF',
    background: '#111111',
  },
  text: {
    code: {
      main: _theme.palette.secondary.light,
      border: alpha(_theme.palette.secondary.dark, 0.5),
    },
  },
};

export const darkPaletteOptions: PaletteOptions = _.merge(_paletteOptions, _extraPaletteOptions);
