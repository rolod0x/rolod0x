import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { Divider, MenuList, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import '@pages/popup/Popup.css';

import Rolod0xText from '@src/components/Rolod0xText';
import { displayLookup } from '@src/shared/lookup';
import withSuspense from '@src/shared/hoc/withSuspense';
import ErrorPage from '@src/components/ErrorPage';

const lookup = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    window.close();
    displayLookup(tabs[0].id);
  });
};

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
        <MenuItem onClick={() => lookup()}>
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Search</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(chrome.runtime.getURL('src/pages/options/index.html#/Help'));
            window.close();
          }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(chrome.runtime.getURL('src/pages/options/index.html#/About'));
            window.close();
          }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>About</ListItemText>
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
