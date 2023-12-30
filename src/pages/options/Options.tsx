import React from 'react';
import { Container } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../../shared/theme';
import OptionsAccordion from './OptionsAccordion';

export default function Options() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Typography variant="h2">rolod0x settings</Typography>
        <OptionsAccordion />
      </Container>
    </ThemeProvider>
  );
}
