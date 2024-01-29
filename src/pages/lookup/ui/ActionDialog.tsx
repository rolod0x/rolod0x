import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Rolod0xText from '../../../components/Rolod0xText';

import ActionBar from './ActionBar';

export default function ActionDialog() {
  const handleClose = () => {
    // We need an origin of * otherwise the parent window won't receive it.
    window.top.postMessage('rolod0x-hide-lookup', '*');
  };

  return (
    <Dialog fullScreen open={true} onClose={handleClose}>
      <DialogTitle variant="h3">
        <Rolod0xText /> address book lookup
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pb: 2 }}>
          Enter one or more search terms, space-separated:
        </DialogContentText>
        <ActionBar handleClose={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
