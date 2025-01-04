import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

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
