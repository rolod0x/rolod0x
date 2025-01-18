import { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Stack,
  Accordion,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import * as murmurhash from 'murmurhash';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

import { useAddressBook } from '@src/shared/hooks/useAddressBook';

import SectionToolbar from './SectionToolbar';
import SectionHeader from './SectionHeader';
import CodeMirrorTextAddresses from './CodeMirrorTextAddresses';

import './LocalAddressBook.css';

interface LocalAddressBookProps {
  sectionId: string;
  _index: number;
  onUnsavedChanges: (sectionId: string, hasChanges: boolean) => void;
}

export default function LocalAddressBook({
  sectionId,
  _index,
  onUnsavedChanges,
}: LocalAddressBookProps) {
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
    expanded,
    updateExpanded,
  } = useAddressBook(sectionId);

  useEffect(() => {
    getSection();
  }, [getSection]);

  useEffect(() => {
    const handleOptionsReset = (_event: Event) => {
      // For options-reset events, confirmation is handled by the parent component
      getSection();
    };

    window.addEventListener('options-reset', handleOptionsReset);

    return () => {
      window.removeEventListener('options-reset', handleOptionsReset);
    };
  }, [getSection]);

  useEffect(() => {
    const labelsChanged = currentLabelsHash !== savedLabelsHash;
    onUnsavedChanges(sectionId, labelsChanged);
  }, [currentLabelsHash, savedLabelsHash, sectionId, onUnsavedChanges]);

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

  const labelsChanged = currentLabelsHash !== savedLabelsHash;
  const canRevert = labelsChanged;
  const canSave = !error && labelsChanged;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (canSave) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canSave, handleSave]);

  useBeforeUnload(
    useCallback(
      event => {
        if (labelsChanged) {
          event.preventDefault();
          return 'You have unsaved changes, are you sure you want to leave?';
        }
      },
      [labelsChanged],
    ),
  );

  useBlocker(
    useCallback(() => {
      if (labelsChanged) {
        return !window.confirm('You have unsaved changes, are you sure you want to leave?');
      }
      return false;
    }, [labelsChanged]),
  );

  return isLoaded ? (
    <>
      <Accordion expanded={expanded} onChange={(_, isExpanded) => updateExpanded(isExpanded)}>
        <SectionHeader
          sectionId={sectionId}
          title={title}
          updateTitle={updateTitle}
          deleteSection={deleteSection}
          hasUnsavedChanges={labelsChanged}
        />
        <AccordionDetails sx={{ ml: '40px', mt: 0 }}>
          <SectionToolbar
            initialUrl={url}
            updateUrl={updateUrl}
            setLabels={setLabels}
            setCurrentLabelsHash={setCurrentLabelsHash}
            validate={validate}
            handleSave={handleSave}
            getSection={getSection}
            canRevert={canRevert}
            canSave={canSave}
          />
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
    </>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
}
