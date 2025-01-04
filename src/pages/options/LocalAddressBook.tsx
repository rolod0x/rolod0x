import { useCallback, useEffect, useRef } from 'react';
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

  const handlePaste = useCallback(async () => {
    const clipboardContents = await window.navigator.clipboard.readText();
    const hash = murmurhash.v3(clipboardContents);
    setLabels(clipboardContents);
    setCurrentLabelsHash(hash);
    validate(clipboardContents);
  }, [setLabels, setCurrentLabelsHash, validate]);

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

  return isLoaded ? (
    <Accordion defaultExpanded={true}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${sectionId}-content`}
        id={`panel-${sectionId}-header`}
        title="Click to expand/collapse">
        <EditableTitle title={title} onTitleChange={handleTitleChange} />
      </StyledAccordionSummary>
      <AccordionDetails>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{ pb: 1 }}>
            <Box>
              <Button
                variant="contained"
                onClick={handlePaste}
                startIcon={<ContentPasteIcon />}
                sx={{ mr: 1 }}>
                Paste
              </Button>
              <Button
                variant="contained"
                onClick={getSection}
                startIcon={<RestorePageIcon />}
                disabled={!canRevert}
                sx={{ mr: 1 }}>
                Discard changes
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                disabled={!canSave}>
                Save
              </Button>
            </Box>
          </Stack>
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
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
}
