import { alpha, lighten, darken, ThemeOptions, createTheme } from '@mui/material/styles';
import _ from 'lodash';

import { typography } from './typography';

const common = {
  typography,
};

// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles' {
  interface TypeBackground {
    selected: string;
    toolbar: string;
  }
  interface TypeText {
    accent: string;
    code: {
      main: string;
      border: string;
    };
    selected: string;
    toolbar: string;
  }
}

// Generate these palettes with https://zenoo.github.io/mui-theme-creator/

export const _lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      // main: '#E4F4F9', // bubbles
      // main: '#387CF7', // bleu de France
      // main: '#6C8BDA', // blue-gray / cornflower
      main: '#517BE8', // royal blue
    },
    secondary: {
      // main: '#8F67CF', // amethyst
      // main: '#6C8BDA', // blue-gray / cornflower
      main: '#8DF2D4', // medium aquamarine / magic mint
    },
    background: {
      default: '#FCFAF3', // Floral white
      // paper: lighten('#EBE5D8', 0.9), // Eggshell
      paper: '#F8F7F4', // Cultured / white smoke
      toolbar: '#EBE5D8', // Eggshell
      // toolbar: '#111111', // smoky black
    },
    text: {
      primary: '#111111',
      selected: '#FFFFFF',
    },
  },
  ...common,
};
const _light = createTheme(_lightThemeOptions);

const _darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      // main: '#79DE0D', // lawn green
      main: lighten('#6C8BDA', 0.2), // blue-gray / cornflower
    },
    secondary: {
      // main: '#D584E7', // violet
      // main: '#7067CF', // slate blue
      main: '#8DF2D4', // medium aquamarine / magic mint
    },
    background: {
      default: '#111111', // smoky black
      paper: '#212121', // raisin black
      toolbar: '#111111', // smoky black
    },
    text: {
      primary: '#FFFFFF',
      selected: '#FFFFFF',
    },
  },
  ...common,
};
const _dark = createTheme(_darkThemeOptions);

/////////////////////////////////////////////////////////////////////////////
// Based colours are now defined, so we can derive further semantic color
// tokens from those.
/////////////////////////////////////////////////////////////////////////////

export const lightThemeOptions: ThemeOptions = _.merge(_lightThemeOptions, {
  palette: {
    background: {
      selected: _light.palette.secondary.main,
    },
    text: {
      accent: _light.palette.primary.main,
      code: {
        main: _light.palette.primary.dark,
        border: alpha(_light.palette.primary.light, 0.5),
      },
      toolbar: '#111111', // smoky black
    },
  },
});

export const darkThemeOptions: ThemeOptions = _.merge(_darkThemeOptions, {
  palette: {
    background: {
      selected: darken(_dark.palette.secondary.dark, 0.2),
    },
    text: {
      accent: _dark.palette.primary.main,
      code: {
        main: _dark.palette.secondary.light,
        border: alpha(_dark.palette.secondary.dark, 0.5),
      },
      toolbar: '#FFFFFF',
    },
  },
});

export const themes = {
  light: createTheme(lightThemeOptions),
  dark: createTheme(darkThemeOptions),
};

export type ThemeName = keyof typeof themes;
