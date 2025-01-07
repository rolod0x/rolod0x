import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import {
  ContentPaste as ContentPasteIcon,
  RestorePage as RestorePageIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import * as murmurhash from 'murmurhash';

interface SectionToolbarProps {
  initialUrl?: string;
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
  initialUrl,
  updateUrl,
  setLabels,
  setCurrentLabelsHash,
  validate,
  handleSave,
  getSection,
  canRevert,
  canSave,
}: SectionToolbarProps) {
  const [fetchUrl, setFetchUrl] = useState('');

  // Initialize fetchUrl from props
  useEffect(() => {
    if (initialUrl) {
      setFetchUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setFetchUrl(newUrl);
      updateUrl(newUrl);
    },
    [updateUrl],
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
        className="section-fetch-button"
        startIcon={<DownloadIcon />}
        title="Click to fetch addresses from the URL"
        disabled={!fetchUrl.trim()}
        onClick={handleFetch}
        sx={{ mr: 1 }}>
        Fetch
      </Button>
      <Button
        variant="contained"
        className="section-paste-button"
        startIcon={<ContentPasteIcon />}
        title="Click to import addresses from the clipboard"
        onClick={handlePaste}
        sx={{ mr: 2 }}>
        Paste
      </Button>
      <Button
        variant="contained"
        className="section-revert-button"
        startIcon={<RestorePageIcon />}
        title="Click to discard changes"
        onClick={handleRevert}
        disabled={!canRevert}>
        Discard changes
      </Button>
      <Button
        variant="contained"
        className="section-save-button"
        startIcon={<SaveIcon />}
        title="Click or type Ctrl+S to save changes"
        onClick={handleSaveClick}
        disabled={!canSave}>
        Save
      </Button>
    </Box>
  );
}
