import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface DeleteSectionDialogProps {
  deleteSection: () => Promise<void>;
  triggerRefresh?: () => void;
}

export default function DeleteSection({ deleteSection, triggerRefresh }: DeleteSectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    await deleteSection();
    setIsOpen(false);
    // Trigger re-render of AddressesSettings if needed
    if (triggerRefresh) {
      triggerRefresh();
    } else {
      window.dispatchEvent(new Event('options-reset'));
    }
  }, [deleteSection, triggerRefresh]);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <Button
        className="section-delete-button"
        variant="contained"
        onClick={openDialog}
        color="warning"
        size="small"
        sx={{ mr: 1 }}>
        Delete section
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description">
        <DialogTitle id="delete-dialog-title">Delete Section?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
