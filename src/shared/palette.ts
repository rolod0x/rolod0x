import { PaletteColorOptions } from '@mui/material/styles';

// https://mui.com/material-ui/customization/theming/#typescript
declare module '@mui/material/styles' {
  interface PaletteOptions {
    accent: PaletteColorOptions;
    selectedOption?: {
      background: string;
      text: string;
    };
    toolbar?: {
      background: string;
      text: string;
    };
  }

  interface TypeText {
    code: {
      main: string;
      border: string;
    };
  }
}

export { lightPaletteOptions } from './palettes/light';
export { darkPaletteOptions } from './palettes/dark';
