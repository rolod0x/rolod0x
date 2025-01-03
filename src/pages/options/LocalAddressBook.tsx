import { useCallback } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as murmurhash from 'murmurhash';

import CodeMirrorTextAddresses from './CodeMirrorTextAddresses';
import StyledCode from './StyledCode';

import '@pages/options/LocalAddressBook.css';

interface LocalAddressBookProps {
  labels: string;
  error: string | null;
  currentLabelsHash: number;
  savedLabelsHash: number;
  onLabelsChange: (labels: string) => void;
  onCurrentLabelsHashChange: (hash: number) => void;
  onSave: () => Promise<void>;
  onGetOptions: () => Promise<void>;
  validate: (labels: string) => void;
}

export default function LocalAddressBook({
  labels,
  error,
  currentLabelsHash,
  savedLabelsHash,
  onLabelsChange,
  onCurrentLabelsHashChange,
  onSave,
  onGetOptions,
  validate,
}: LocalAddressBookProps) {
  const handleLabelsChange = useCallback(
    async (newValue: string) => {
      onLabelsChange(newValue);
      const hash = murmurhash.v3(newValue);
      onCurrentLabelsHashChange(hash);
      validate(newValue);
    },
    [onLabelsChange, onCurrentLabelsHashChange, validate],
  );

  const handlePaste = useCallback(async () => {
    const clipboardContents = await window.navigator.clipboard.readText();
    const hash = murmurhash.v3(clipboardContents);
    onLabelsChange(clipboardContents);
    onCurrentLabelsHashChange(hash);
    validate(clipboardContents);
  }, [onLabelsChange, onCurrentLabelsHashChange, validate]);

  const labelsChanged = currentLabelsHash !== savedLabelsHash;
  const canRevert = labelsChanged;
  const canSave = !error && labelsChanged;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ pb: 1 }}>
        <Box>
          <Typography>
            Enter your address labels here, one on each line. Each entry should look something like:
          </Typography>
          <Box p={2}>
            <StyledCode>0xaddress Label for address</StyledCode>
          </Box>
          <Typography>
            You can optionally add{' '}
            <StyledCode className="example-comment">{'//'} a comment</StyledCode> after the address
            to provide more information.
          </Typography>
        </Box>
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
            onClick={onGetOptions}
            startIcon={<RestorePageIcon />}
            disabled={!canRevert}
            sx={{ mr: 1 }}>
            Discard changes
          </Button>
          <Button variant="contained" onClick={onSave} startIcon={<SaveIcon />} disabled={!canSave}>
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
  );
}
