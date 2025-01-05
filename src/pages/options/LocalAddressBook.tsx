import { useCallback, useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import * as murmurhash from 'murmurhash';
import { styled } from '@mui/material/styles';

import { useAddressBook } from '@src/shared/hooks/useAddressBook';

import CodeMirrorTextAddresses from './CodeMirrorTextAddresses';
import EditableTitle from './EditableTitle';

import '@pages/options/LocalAddressBook.css';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper': {
    marginRight: theme.spacing(1),
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'transparent',
  },
}));

interface LocalAddressBookProps {
  sectionId: string;
  index: number;
}

export default function LocalAddressBook({ sectionId }: LocalAddressBookProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fetchUrl, setFetchUrl] = useState('');
  const {
    labels,
    error,
    currentLabelsHash,
    savedLabelsHash,
    isLoaded,
    setLabels,
    setCurrentLabelsHash,
    handleSave,
    getSection,
    validate,
    title,
    updateTitle,
    deleteSection,
    url,
    updateUrl,
  } = useAddressBook(sectionId);

  useEffect(() => {
    getSection();
  }, [getSection]);

  useEffect(() => {
    const handleOptionsReset = () => {
      getSection();
    };

    window.addEventListener('options-reset', handleOptionsReset);

    return () => {
      window.removeEventListener('options-reset', handleOptionsReset);
    };
  }, [getSection]);

  // Initialize fetchUrl from storage
  useEffect(() => {
    if (url) {
      setFetchUrl(url);
    }
  }, [url]);

  const validateTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLabelsChange = useCallback(
    async (newValue: string) => {
      setLabels(newValue);
      const hash = murmurhash.v3(newValue);
      setCurrentLabelsHash(hash);

      // Clear any pending validation
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current);
      }

      // Set new validation timeout
      validateTimeoutRef.current = setTimeout(() => {
        validate(newValue);
      }, 1000);
    },
    [setLabels, setCurrentLabelsHash, validate],
  );

  const handlePaste = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const clipboardContents = await window.navigator.clipboard.readText();
      const hash = murmurhash.v3(clipboardContents);
      setLabels(clipboardContents);
      setCurrentLabelsHash(hash);
      validate(clipboardContents);
    },
    [setLabels, setCurrentLabelsHash, validate],
  );

  const handleRevert = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      getSection();
    },
    [getSection],
  );

  const handleSaveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleSave();
    },
    [handleSave],
  );

  const labelsChanged = currentLabelsHash !== savedLabelsHash;
  const canRevert = labelsChanged;
  const canSave = !error && labelsChanged;

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (updateTitle) {
        updateTitle(newTitle);
      }
    },
    [updateTitle],
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteSection();
    setIsDeleteDialogOpen(false);
    // Trigger re-render of AddressesSettings
    window.dispatchEvent(new Event('options-reset'));
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleFetch = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        setLabels(content);
        const hash = murmurhash.v3(content);
        setCurrentLabelsHash(hash);
        validate(content);
      } catch (error) {
        console.error('Error fetching URL:', error);
        validate('Error fetching URL: ' + (error instanceof Error ? error.message : String(error)));
      }
    },
    [fetchUrl, setLabels, setCurrentLabelsHash, validate],
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setFetchUrl(newUrl);
      updateUrl(newUrl);
    },
    [updateUrl],
  );

  return isLoaded ? (
    <>
      <Accordion defaultExpanded={true}>
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${sectionId}-content`}
          id={`panel-${sectionId}-header`}
          title="Click to expand/collapse">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditableTitle title={title} onTitleChange={handleTitleChange} />
            </Box>
            <Button
              className="section-delete-button"
              variant="contained"
              onClick={handleDeleteClick}
              startIcon={<DeleteIcon />}
              size="small"
              color="warning"
              sx={{ mr: 1 }}>
              Delete section
            </Button>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ ml: '40px', mt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              placeholder="Enter URL to fetch addresses"
              value={fetchUrl}
              onChange={handleUrlChange}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={handleFetch}
              disabled={!fetchUrl.trim()}>
              Fetch
            </Button>
            <Button
              className="section-paste-button"
              variant="contained"
              onClick={handlePaste}
              startIcon={<ContentPasteIcon />}
              size="small"
              sx={{ mr: 1 }}>
              Paste
            </Button>
            <Button
              className="section-revert-button"
              variant="contained"
              onClick={handleRevert}
              startIcon={<RestorePageIcon />}
              disabled={!canRevert}
              size="small"
              sx={{ mr: 1 }}>
              Discard changes
            </Button>
            <Button
              className="section-save-button"
              variant="contained"
              onClick={handleSaveClick}
              startIcon={<SaveIcon />}
              disabled={!canSave}
              size="small"
              sx={{ mr: 1 }}>
              Save
            </Button>
          </Box>
          <Box>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="warning" style={{ display: !error && 'none' }}>
                <AlertTitle>Error parsing address book</AlertTitle>
                {error}
              </Alert>
            </Stack>
            <CodeMirrorTextAddresses value={labels} onChange={handleLabelsChange} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description">
        <DialogTitle id="delete-dialog-title">Delete Section?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
}
