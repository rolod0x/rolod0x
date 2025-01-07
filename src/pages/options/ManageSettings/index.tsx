import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { JSONTree } from 'react-json-tree';

import { usePageTitle } from '@root/src/shared/contexts/PageTitleContext';
import {
  deserializeOptions,
  optionsStorage,
  Rolod0xOptionsDeserialized,
  validateDeserialized,
} from '@src/shared/options-storage';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';
import Rolod0xText from '@root/src/components/Rolod0xText';

import SectionTitle from '../shared/SectionTitle';

const ManageSettings = () => {
  const { setPageTitle } = usePageTitle();
  useEffect(() => {
    setPageTitle(
      <>
        Manage <Rolod0xText bold /> settings
      </>,
    );
  }, [setPageTitle]);

  const [rawOptions, setRawOptions] = useState<object>({});
  const theme = useTheme();
  const { hydrateTheme } = useContext(ThemeNameContext);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmImport, setShowConfirmImport] = useState(false);
  const [showImportError, setShowImportError] = useState(false);
  const [importErrorMessage, setImportErrorMessage] = useState('');
  const [importData, setImportData] = useState<Rolod0xOptionsDeserialized | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRawOptions = useCallback(async () => {
    const options = await optionsStorage.getAllDeserialized();
    setRawOptions(options);
  }, []);

  useEffect(() => {
    fetchRawOptions();
  }, [fetchRawOptions]);

  const resetToDefaults = async () => {
    const options = deserializeOptions(await optionsStorage.resetToDefaults());
    setRawOptions(options);

    // Trigger theme update
    await hydrateTheme();

    // Dispatch custom event to notify other components of options reset
    //
    // FIXME: kind of hacky and inconsistent to be dispatching events
    // here but not for updating the theme - we'd probably be better
    // off using Redux
    window.dispatchEvent(new CustomEvent('options-reset', { detail: options }));
  };

  const handleResetClick = () => {
    setShowConfirmReset(true);
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(rawOptions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rolod0x-options.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      setImportData(data);
      setShowConfirmImport(true);
    } catch (error) {
      console.error('Error reading import file:', error);
      setImportErrorMessage(
        'Failed to parse the uploaded file. Please ensure it is a valid JSON file.',
      );
      setShowImportError(true);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportConfirm = async () => {
    if (!importData) return;

    const validationResult = validateDeserialized(importData);
    if (!validationResult.success) {
      console.error('Invalid import data:', validationResult.error);
      setImportErrorMessage(
        'The imported file contains invalid data. Please check the console for details.',
      );
      setShowImportError(true);
      setShowConfirmImport(false);
      return;
    }

    try {
      await optionsStorage.setAllDeserialized(importData);
      const options = await optionsStorage.getAllDeserialized();
      setRawOptions(options);
      await hydrateTheme();
      window.dispatchEvent(new CustomEvent('options-reset', { detail: options }));
      setShowConfirmImport(false);
      setImportData(null);
    } catch (error) {
      console.error('Error importing settings:', error);
      setImportErrorMessage('Failed to save the imported settings.');
      setShowImportError(true);
    }
  };

  // Theme that matches MUI dark/light mode
  // See https://github.com/reduxjs/redux-devtools/blob/main/packages/react-json-tree/src/createStylingFromTheme.ts
  const UNUSED = '#ff0000';
  const jsonTreeTheme = {
    base00: theme.palette.background.default, // BACKGROUND
    base01: UNUSED,
    base02: UNUSED,
    base03: theme.palette.text.disabled, // ITEM_STRING_EXPANDED
    base04: UNUSED,
    base05: UNUSED,
    base06: UNUSED,
    base07: '#00ff00', // TEXT
    base08: theme.palette.error.main, // NULL / UNDEFINED / FUNCTION / SYMBOL
    base09: theme.palette.text.secondary, // NUMBER / BOOLEAN
    base0A: UNUSED,
    base0B: theme.palette.secondary.main, // ITEM_STRING
    base0C: UNUSED,
    base0D: theme.palette.primary.main, // LABEL / ARROW
    base0E: UNUSED,
    base0F: UNUSED,
  };

  return (
    <>
      <Box>
        <Typography paragraph>
          On this page you can view and manage all your data and settings stored in{' '}
          <Rolod0xText bold />.
        </Typography>

        <SectionTitle first title="Export / import / factory reset" />
        <Typography variant="body1" sx={{ mb: 2 }}>
          You can export your settings to a JSON file and re-import them later. This allows backup
          and restore but also transferring settings between computers.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}>
            Export
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileUploadIcon />}
            onClick={handleImportClick}>
            Import
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<WarningIcon />}
            onClick={handleResetClick}>
            Reset to defaults
          </Button>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="application/json"
          onChange={handleFileSelect}
        />

        <SectionTitle title="Raw options data" />
        <JSONTree
          data={rawOptions}
          theme={jsonTreeTheme}
          invertTheme={theme.palette.mode === 'light'}
          shouldExpandNodeInitially={(_keyPath, _data, level) => level < 3}
        />
      </Box>

      <Dialog open={showConfirmReset} onClose={() => setShowConfirmReset(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all options to their default values? This cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmReset(false)}>Cancel</Button>
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              setShowConfirmReset(false);
              resetToDefaults();
            }}
            startIcon={<WarningIcon />}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showConfirmImport} onClose={() => setShowConfirmImport(false)}>
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to import these settings? This will overwrite your current
            settings and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmImport(false)}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleImportConfirm}
            startIcon={<FileUploadIcon />}>
            Import
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showImportError} onClose={() => setShowImportError(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          Import Error
        </DialogTitle>
        <DialogContent>
          <Typography>{importErrorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportError(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageSettings;
