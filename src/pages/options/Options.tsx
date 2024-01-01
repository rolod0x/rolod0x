import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../../shared/theme';

import ResponsiveDrawer from './ResponsiveDrawer';

export default function Options() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveDrawer />
    </ThemeProvider>
  );
}
