import { useCallback, useEffect, useRef, useState } from 'react';
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

import { useAddressBook } from '@src/shared/hooks/useAddressBook';

import SectionToolbar from './SectionToolbar';
import SectionHeader from './SectionHeader';
import CodeMirrorTextAddresses from './CodeMirrorTextAddresses';

import './LocalAddressBook.css';

interface LocalAddressBookProps {
  sectionId: string;
  index: number;
}

export default function LocalAddressBook({ sectionId }: LocalAddressBookProps) {
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

  const labelsChanged = currentLabelsHash !== savedLabelsHash;
  const canRevert = labelsChanged;
  const canSave = !error && labelsChanged;

  return isLoaded ? (
    <>
      <Accordion defaultExpanded={true}>
        <SectionHeader
          sectionId={sectionId}
          title={title}
          updateTitle={updateTitle}
          deleteSection={deleteSection}
        />
        <AccordionDetails sx={{ ml: '40px', mt: 0 }}>
          <SectionToolbar
            fetchUrl={fetchUrl}
            setFetchUrl={setFetchUrl}
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
