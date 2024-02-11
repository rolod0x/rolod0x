import { TypographyVariantsOptions } from '@mui/material/styles';

const headerFont = 'Ubuntu Mono';

export const typography: TypographyVariantsOptions = {
  fontFamily: ['"Open Sans"', 'Ubuntu', 'Roboto', 'Oxygen', 'sans-serif'].join(', '),
  h1: {
    fontFamily: headerFont,
  },
  h2: {
    fontFamily: headerFont,
  },
  h3: {
    fontFamily: headerFont,
  },
  h4: {
    fontFamily: headerFont,
  },
  h6: {
    fontFamily: headerFont,
  },
  h5: {
    fontFamily: headerFont,
  },
  subtitle1: {
    fontFamily: headerFont,
  },
  subtitle2: {
    fontFamily: headerFont,
  },
  button: {
    fontFamily: headerFont,
    fontWeight: 900,
  },
  overline: {
    fontFamily: headerFont,
  },
};
