import { ChangeEvent, MouseEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';
import {
  ContentPaste as ContentPasteIcon,
  RestorePage as RestorePageIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface AddressBookToolbarProps {
  fetchUrl: string;
  onUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFetch: (e: MouseEvent) => void;
  onPaste: (e: MouseEvent) => void;
  onRevert: (e: MouseEvent) => void;
  onSave: (e: MouseEvent) => void;
  canRevert: boolean;
  canSave: boolean;
}

export default function AddressBookToolbar({
  fetchUrl,
  onUrlChange,
  onFetch,
  onPaste,
  onRevert,
  onSave,
  canRevert,
  canSave,
}: AddressBookToolbarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <TextField
        size="small"
        placeholder="Enter URL to fetch addresses"
        value={fetchUrl}
        onChange={onUrlChange}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        size="small"
        onClick={onFetch}
        disabled={!fetchUrl.trim()}>
        Fetch
      </Button>
      <Button
        className="section-paste-button"
        variant="contained"
        onClick={onPaste}
        startIcon={<ContentPasteIcon />}
        size="small"
        sx={{ mr: 1 }}>
        Paste
      </Button>
      <Button
        className="section-revert-button"
        variant="contained"
        onClick={onRevert}
        startIcon={<RestorePageIcon />}
        disabled={!canRevert}
        size="small"
        sx={{ mr: 1 }}>
        Discard changes
      </Button>
      <Button
        className="section-save-button"
        variant="contained"
        onClick={onSave}
        startIcon={<SaveIcon />}
        disabled={!canSave}
        size="small"
        sx={{ mr: 1 }}>
        Save
      </Button>
    </Box>
  );
}
