import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useContext, useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { useTheme } from '@mui/material/styles';

import { deserializeOptions, optionsStorage } from '@src/shared/options-storage';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

const RawOptionsDialog = () => {
  const [showRawOptions, setShowRawOptions] = useState(false);
  const [rawOptions, setRawOptions] = useState<object>({});
  const theme = useTheme();
  const { hydrateTheme } = useContext(ThemeNameContext);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleCornerClick = async () => {
    const options = await optionsStorage.getAllDeserialized();
    setRawOptions(options);
    setShowRawOptions(true);
  };

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
      <Box
        onClick={handleCornerClick}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          cursor: 'default',
          zIndex: 9999,
        }}
      />
      <Dialog
        open={showRawOptions}
        onClose={() => setShowRawOptions(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>Raw options</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This hidden dialog shows the raw options data stored in the extension. You can come back
            to it any time by clicking near the top left corner of the settings page.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<WarningIcon />}
              onClick={handleResetClick}>
              Reset to defaults
            </Button>
            <Button variant="contained" onClick={() => setShowRawOptions(false)}>
              Close
            </Button>
          </Box>
          <JSONTree
            data={rawOptions}
            theme={jsonTreeTheme}
            invertTheme={theme.palette.mode === 'light'}
            shouldExpandNodeInitially={(_keyPath, _data, level) => level < 2}
          />
        </DialogContent>
      </Dialog>
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
            }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RawOptionsDialog;
