import { ChangeEvent, MouseEvent, useCallback } from 'react';
import { Box, Button, TextField } from '@mui/material';
import {
  ContentPaste as ContentPasteIcon,
  RestorePage as RestorePageIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import * as murmurhash from 'murmurhash';

interface SectionToolbarProps {
  fetchUrl: string;
  setFetchUrl: (url: string) => void;
  updateUrl: (url: string) => void;
  setLabels: (labels: string) => void;
  setCurrentLabelsHash: (hash: number) => void;
  validate: (content: string) => void;
  handleSave: () => void;
  getSection: () => void;
  canRevert: boolean;
  canSave: boolean;
}

export default function SectionToolbar({
  fetchUrl,
  setFetchUrl,
  updateUrl,
  setLabels,
  setCurrentLabelsHash,
  validate,
  handleSave,
  getSection,
  canRevert,
  canSave,
}: SectionToolbarProps) {
  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setFetchUrl(newUrl);
      updateUrl(newUrl);
    },
    [setFetchUrl, updateUrl],
  );

  const handleFetch = useCallback(
    async (e: MouseEvent) => {
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

  const handlePaste = useCallback(
    async (e: MouseEvent) => {
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
    (e: MouseEvent) => {
      e.stopPropagation();
      getSection();
    },
    [getSection],
  );

  const handleSaveClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      handleSave();
    },
    [handleSave],
  );

  return (
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
  );
}
