import { useCallback, ReactNode } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Contacts as ContactsIcon,
  CardGiftcard as CardGiftcardIcon,
  DisplaySettings as DisplaySettingsIcon,
  DomainVerification as DomainVerificationIcon,
  ImportExport as ImportExportIcon,
  Help as HelpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

interface DrawerItemProps {
  page: string;
  children: ReactNode;
}

const OptionsDrawer = () => {
  const location = useLocation();

  const DrawerItem = useCallback(
    ({ page, children }: DrawerItemProps) => {
      const path = '/' + page;
      const selected =
        location.pathname === path ||
        location.hash === '#' + path ||
        (location.pathname === '/' && location.hash === '' && page === 'Addresses');
      // console.log('OptionsDrawer page', page, 'selected', selected);
      return (
        <NavLink to={path} style={{ textDecoration: 'none' }}>
          <ListItem
            key={page}
            disablePadding
            sx={{ bgcolor: selected && 'selectedOption.background' }}>
            <ListItemButton>
              <ListItemIcon>{children}</ListItemIcon>
              <ListItemText
                primary={page}
                sx={{ color: selected ? 'selectedOption.text' : 'text.primary' }}
              />
            </ListItemButton>
          </ListItem>
        </NavLink>
      );
    },
    [location],
  );

  return (
    <div>
      <Toolbar>
        <img src="/icon-104x100-no-bg.png" className="logo-icon" alt="rolod0x logo icon" />
      </Toolbar>
      <Divider />
      <List>
        <DrawerItem page="Addresses">
          <ContactsIcon />
        </DrawerItem>
        <DrawerItem page="Display">
          <DisplaySettingsIcon />
        </DrawerItem>
        <DrawerItem page="Sites">
          <DomainVerificationIcon />
        </DrawerItem>
        <DrawerItem page="Donate">
          <CardGiftcardIcon />
        </DrawerItem>
        <DrawerItem page="Manage">
          <ImportExportIcon />
        </DrawerItem>
        <DrawerItem page="Help">
          <HelpIcon />
        </DrawerItem>
        <DrawerItem page="About">
          <InfoIcon />
        </DrawerItem>
      </List>
    </div>
  );
};

export default OptionsDrawer;
