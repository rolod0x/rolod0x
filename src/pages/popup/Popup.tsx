import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsIcon from '@mui/icons-material/Settings';

import '@pages/popup/Popup.css';
import Rolod0xText from '@src/components/Rolod0xText';
import withSuspense from '@src/shared/hoc/withSuspense';
import ErrorPage from '@src/components/ErrorPage';

const Popup = () => {
  const manifest = chrome.runtime.getManifest();

  return (
    <div
      className="App"
      style={{
        backgroundColor: 'toolbar.background',
      }}>
      <MenuList
        sx={{
          p: 0,
          '& .MuiMenuItem-root:hover': { backgroundColor: 'selectedOption.background' },
        }}>
        <MenuItem onClick={() => chrome.runtime.openOptionsPage()}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
          <ListItemText>
            <Rolod0xText bold /> {manifest.version}
          </ListItemText>
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <h1> Loading rolod0x popup... </h1>), {
  fallbackRender: ({ error }) => <ErrorPage error={error} />,
});
