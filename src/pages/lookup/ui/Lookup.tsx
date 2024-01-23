import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../../../shared/theme';

import ActionBar from './ActionBar';

export default function Lookup() {
  useEffect(() => {
    console.log('lookup popup loaded');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container style={{ position: 'fixed', top: 200, minWidth: 500, maxWidth: 1000 }}>
        <Paper elevation={2}>
          <ActionBar />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
