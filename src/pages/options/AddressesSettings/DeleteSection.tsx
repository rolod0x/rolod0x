import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteSectionDialogProps {
  deleteSection: () => Promise<void>;
  triggerRefresh?: () => void;
  hasUnsavedChanges: boolean;
}

export default function DeleteSection({
  deleteSection,
  triggerRefresh,
  hasUnsavedChanges,
}: DeleteSectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Check for unsaved changes in this section
      if (hasUnsavedChanges) {
        const shouldProceed = window.confirm(
          'This section has unsaved changes. Are you sure you want to delete it and lose these changes?',
        );
        if (!shouldProceed) {
          setIsOpen(false);
          return;
        }
      }

      await deleteSection();
      setIsOpen(false);
      // Trigger re-render of AddressesSettings if needed
      if (triggerRefresh) {
        triggerRefresh();
      } else {
        window.dispatchEvent(new Event('delete-section'));
      }
    },
    [deleteSection, triggerRefresh, hasUnsavedChanges],
  );

  const openDialog = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  return (
    <>
      <Button
        className="section-delete-button"
        variant="contained"
        onClick={openDialog}
        color="warning"
        title="Click to delete this section"
        startIcon={<DeleteIcon />}
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
