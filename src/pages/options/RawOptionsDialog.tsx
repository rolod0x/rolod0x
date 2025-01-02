import { Dialog, DialogTitle, DialogContent, Box, Typography, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useContext, useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { useTheme } from '@mui/material/styles';

import { optionsStorage, DEFAULT_OPTIONS } from '@src/shared/options-storage';
import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

const RawOptionsDialog = () => {
  const [showRawOptions, setShowRawOptions] = useState(false);
  const [rawOptions, setRawOptions] = useState<object>({});
  const theme = useTheme();
  const { hydrateTheme } = useContext(ThemeNameContext);

  const handleCornerClick = async () => {
    const options = await optionsStorage.getAll();
    setRawOptions(options);
    setShowRawOptions(true);
  };

  const resetToDefaults = async () => {
    await optionsStorage.setAll(DEFAULT_OPTIONS);
    const options = await optionsStorage.getAll();
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
            This hidden dialog shows the raw options data stored in the extension. You can view it
            by clicking near the top left corner of the settings page.
          </Typography>
          <Button
            variant="contained"
            color="warning"
            startIcon={<WarningIcon />}
            onClick={resetToDefaults}>
            Reset to defaults
          </Button>
          <JSONTree
            data={rawOptions}
            theme={jsonTreeTheme}
            invertTheme={theme.palette.mode === 'light'}
            shouldExpandNodeInitially={(_keyPath, _data, level) => level < 2}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RawOptionsDialog;
