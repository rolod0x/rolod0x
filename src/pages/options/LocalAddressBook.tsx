import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as murmurhash from 'murmurhash';

import { Parser, ParseError } from '../../shared/parser';
import { optionsStorage } from '../../shared/options-storage';

import CodeMirrorTextAddresses from './CodeMirrorTextAddresses';
import StyledCode from './StyledCode';

import '@pages/options/LocalAddressBook.css';

export default function LocalAddressBook() {
  const [labels, setLabels] = useState('');
  const [currentLabelsHash, setCurrentLabelsHash] = useState(murmurhash.v3(''));
  const [savedLabelsHash, setSavedLabelsHash] = useState(murmurhash.v3(''));
  const [error, setError] = useState<string | null>();

  const validate = useCallback(
    (labels: string): void => {
      if (!labels) return;

      try {
        console.log(`Parsing: ${labels.slice(0, 30)}...`);
        const parser = new Parser(labels);
        console.log(`Parsed ${parser.parsedEntries.length} entries`);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof ParseError) {
          console.log(err.message);
          setError(err.message);
        } else if (err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        } else {
          console.error(err);
        }
      }
    },
    [setError],
  );

  const handleLabelsChange = useCallback(
    async newValue => {
      setLabels(newValue);
      const hash = murmurhash.v3(newValue);
      setCurrentLabelsHash(hash);
      validate(newValue);
    },
    [setLabels, validate],
  );

  const handleSave = useCallback(async () => {
    await optionsStorage.set({ labels });
    const hash = murmurhash.v3(labels);
    setSavedLabelsHash(hash);
    validate(labels);
  }, [labels, validate]);

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getAll();
    setLabels(options.labels);
    const hash = murmurhash.v3(options.labels);
    console.log(`Hydrated options from storage (hash ${hash})`);
    setCurrentLabelsHash(hash);
    setSavedLabelsHash(hash);
    validate(options.labels);
  }, [setLabels, validate]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  const labelsChanged = currentLabelsHash !== savedLabelsHash;
  const canSave = !error && labelsChanged;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ pb: 1 }}>
        <Box>
          <Typography>
            Enter your address labels here, one on each line. Each entry should look something like:
          </Typography>
          <Box p={2} fontFamily="Monospace">
            <StyledCode>0xaddress Label for address</StyledCode>
          </Box>
          <Typography>
            You can optionally add{' '}
            <StyledCode className="example-comment">{'//'} a comment</StyledCode> after the address
            to provide more information.
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
        </Box>
      </Stack>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error" style={{ display: !error && 'none' }}>
          <AlertTitle>Error parsing address book</AlertTitle>
          {error}
        </Alert>
      </Stack>
      <CodeMirrorTextAddresses value={labels} onChange={handleLabelsChange} />
    </Box>
  );
}
