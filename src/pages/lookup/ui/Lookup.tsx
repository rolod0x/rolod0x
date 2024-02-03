import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import Rolod0xThemeProvider from '../../../components/Rolod0xThemeProvider';

import ActionDialog from './ActionDialog';

export default function Lookup() {
  return (
    <Rolod0xThemeProvider>
      <Container style={{ position: 'fixed', top: 200, minWidth: 500, maxWidth: 1000 }}>
        <Paper elevation={2}>
          <ActionDialog />
        </Paper>
      </Container>
    </Rolod0xThemeProvider>
  );
}
