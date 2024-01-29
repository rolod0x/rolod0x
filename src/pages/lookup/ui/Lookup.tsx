import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../../../shared/theme';

import ActionDialog from './ActionDialog';

export default function Lookup() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container style={{ position: 'fixed', top: 200, minWidth: 500, maxWidth: 1000 }}>
        <Paper elevation={2}>
          <ActionDialog />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
