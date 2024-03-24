import { alpha, darken, PaletteOptions, ThemeOptions, createTheme } from '@mui/material/styles';
import _ from 'lodash';

// Generate these palettes with https://zenoo.github.io/mui-theme-creator/

const _paletteOptions: PaletteOptions = {
  mode: 'light',
  primary: {
    // main: '#E4F4F9', // bubbles
    // main: '#387CF7', // bleu de France
    // main: '#6C8BDA', // blue-gray / cornflower
    main: '#517BE8', // royal blue
  },
  secondary: {
    // main: '#8F67CF', // amethyst
    // main: '#8EE0C8', // aquamarine
    main: '#8DD9CC', // middle blue green
  },
  accent: {
    main: '#F4E174', // Jasmine
  },
  background: {
    default: '#FCFAF3', // Floral white
    // paper: lighten('#EBE5D8', 0.9), // Eggshell
    paper: '#F8F7F4', // Cultured / white smoke
  },
  text: {
    primary: '#111111',
    secondary: '#222222',
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
    background: darken(_theme.palette.secondary.main, 0.2),
  },
  toolbar: {
    text: '#111111', // smoky black
    background: '#EBE5D8', // Eggshell
  },
  text: {
    code: {
      main: _theme.palette.primary.dark,
      border: alpha(_theme.palette.primary.light, 0.3),
    },
  },
};

export const lightPaletteOptions: PaletteOptions = _.merge(_paletteOptions, _extraPaletteOptions);
