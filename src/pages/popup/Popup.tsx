import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsIcon from '@mui/icons-material/Settings';

import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import themeStorage from '@src/shared/storages/themeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import ErrorPage from '@src/components/ErrorPage';

const Popup = () => {
  const theme = useStorage(themeStorage);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <MenuList sx={{ p: 0 }}>
        <MenuItem onClick={() => chrome.runtime.openOptionsPage()}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <h1> Loading rolod0x popup... </h1>), {
  fallbackRender: ({ error }) => <ErrorPage error={error} />,
});
