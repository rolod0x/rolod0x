import React from 'react';
import { Container } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

import OptionsAccordion from './OptionsAccordion';

export default function Options() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Typography variant="h2">rolod0x settings</Typography>
        <OptionsAccordion />
      </Container>
    </React.Fragment>
  );
}
