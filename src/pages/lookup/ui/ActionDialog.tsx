import { useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import Rolod0xText from '@src/components/Rolod0xText';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

import ActionBar from './ActionBar';

export default function ActionDialog() {
  const { themeName } = useContext(ThemeNameContext);

  const handleClose = () => {
    // We need an origin of * otherwise the parent window won't receive it.
    window.top.postMessage('rolod0x-hide-lookup', '*');
  };

  return (
    <Dialog
      fullScreen
      PaperProps={{
        elevation: themeName === 'light' ? 8 : 0,
        sx: {
          m: 3, // Give space for elevation shadow

          // Shrink <Paper> to accommodate the above margin
          // FIXME: does this work on Firefox?
          width: ['-webkit-fill-available', '-moz-available'],
          height: ['-webkit-fill-available', '-moz-available'],
          // This doesn't seem to work:
          // style: 'height: -webkit-fill-available; height: -moz-available;',

          ...(themeName === 'light' && {
            border: 2,
            borderColor: 'divider',
            borderRadius: 4,
          }),
        },
      }}
      open={true}
      hideBackdrop={true}
      onClose={handleClose}>
      <Stack direction="row" justifyContent="space-between">
        <DialogTitle variant="h3">
          <Rolod0xText /> address book lookup
        </DialogTitle>
        <DialogActions>
          <IconButton
            onClick={handleClose}
            color="primary"
            aria-label="Close the rolod0x search dialog">
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Stack>
      <DialogContent>
        <DialogContentText sx={{ pb: 2 }}>
          Enter one or more search terms, space-separated:
        </DialogContentText>
        <ActionBar handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
