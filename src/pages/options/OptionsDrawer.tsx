import { useCallback, ReactNode } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

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
        location.pathname === path || (location.key === 'default' && page === 'Addresses');
      // console.log('OptionsDrawer page', page, 'selected', selected);
      return (
        <NavLink to={path} style={{ textDecoration: 'none' }}>
          <ListItem key={page} disablePadding sx={{ bgcolor: selected && 'background.selected' }}>
            <ListItemButton>
              <ListItemIcon>{children}</ListItemIcon>
              <ListItemText primary={page} sx={{ color: 'text.primary' }} />
            </ListItemButton>
          </ListItem>
        </NavLink>
      );
    },
    [location],
  );

  return (
    <div>
      <Toolbar />
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
      </List>
    </div>
  );
};

export default OptionsDrawer;
