import { createContext, ReactNode, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

interface Props {
  id: string;
  title: ReactNode;
  children?: ReactNode;
}

export const CloserContext = createContext(null);

export default function IframeModal(props: Props) {
  const { themeName } = useContext(ThemeNameContext);

  const handleClose = () => {
    // We need an origin of * otherwise the parent window won't receive it.
    window.top.postMessage(`rolod0x-hide-${props.id}`, '*');
  };

  return (
    <CloserContext.Provider value={handleClose}>
      {' '}
      <Dialog
        fullScreen
        PaperProps={{
          elevation: themeName === 'light' ? 8 : 0,
          sx: {
            m: 3, // Give space for elevation shadow

            // Shrink <Paper> to accommodate the above margin
            // FIXME: does this work on Firefox?
            width: ['-webkit-fill-available', '-moz-available'],
            height: ['-webkit-fill-available', '-moz-available'],
            // This doesn't seem to work:
            // style: 'height: -webkit-fill-available; height: -moz-available;',

            ...(themeName === 'light' && {
              border: 2,
              borderColor: 'divider',
              borderRadius: 4,
            }),
          },
        }}
        open={true}
        hideBackdrop={true}
        onClose={handleClose}>
        <Stack direction="row" justifyContent="space-between">
          <DialogTitle variant="h3">{props.title}</DialogTitle>
          <DialogActions>
            <IconButton
              onClick={handleClose}
              color="primary"
              aria-label={`Close the rolod0x ${props.id} dialog"`}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Stack>
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </CloserContext.Provider>
  );
}
