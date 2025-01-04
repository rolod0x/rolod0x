import { useCallback } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from 'react-router-dom';

import { optionsStorage } from '@src/shared/options-storage';
import Rolod0xText from '@root/src/components/Rolod0xText';

const Help = () => {
  const navigate = useNavigate();

  const handleRestartTour = useCallback(async () => {
    await optionsStorage.set({ hasSeenTour: false });
    navigate('/settings'); // Navigate to the Settings tab
  }, [navigate]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help
      </Typography>
      <Typography paragraph>
        This section contains documentation, guides, and FAQs to help you make the most of{' '}
        <Rolod0xText />.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRestartTour}
          startIcon={<RestartAltIcon />}>
          Restart Interactive Tour
        </Button>
        <Button
          variant="contained"
          color="primary"
          href="https://rolod0x.io/docs/user-manual.html"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<OpenInNewIcon />}>
          User Manual
        </Button>
        <Button
          variant="contained"
          color="primary"
          href="https://rolod0x.io/docs/FAQ.html"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<OpenInNewIcon />}>
          FAQ
        </Button>
        <Button
          variant="contained"
          color="primary"
          href="https://rolod0x.io/docs/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<OpenInNewIcon />}>
          Privacy Policy
        </Button>
      </Stack>
    </Box>
  );
};

export default Help;
