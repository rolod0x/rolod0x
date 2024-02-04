import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import Rolod0xText from '@src/components/Rolod0xText';

import ActionBar from './ActionBar';

export default function ActionDialog() {
  const handleClose = () => {
    // We need an origin of * otherwise the parent window won't receive it.
    window.top.postMessage('rolod0x-hide-lookup', '*');
  };

  return (
    <Dialog fullScreen open={true} onClose={handleClose}>
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
