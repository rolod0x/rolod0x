import { createContext, ReactNode, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';

import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

interface Props {
  id: string;
  title: ReactNode;
  children?: ReactNode;
}

export const IframeContext = createContext(null);

export default function IframeModal(props: Props) {
  const { themeName } = useContext(ThemeNameContext);

  const handleUpdate = () => {
    // We need an origin of * otherwise the parent window won't receive it.
    window.top.postMessage(`rolod0x-update-${props.id}`, '*');
  };

  const handleClose = () => {
    window.top.postMessage(`rolod0x-close-${props.id}`, '*');
  };

  return (
    <IframeContext.Provider value={{ handleUpdate, handleClose }}>
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
    </IframeContext.Provider>
  );
}
