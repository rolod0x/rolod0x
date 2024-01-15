import { useCallback, ReactNode } from 'react';
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

interface DrawerProps {
  currentPage: string;
  setPage: (string) => void;
}

interface DrawerItemProps {
  page: string;
  children: ReactNode;
}

const OptionsDrawer = ({ currentPage, setPage }: DrawerProps) => {
  const clickHandler = useCallback(
    (newPage: string) => {
      return () => {
        console.log(`Switching page to ${newPage}`);
        setPage(newPage);
      };
    },
    [setPage],
  );

  const DrawerItem = useCallback(
    ({ page, children }: DrawerItemProps) => {
      const selected = page === currentPage;
      return (
        <ListItem key={page} disablePadding sx={{ bgcolor: selected && 'primary.dark' }}>
          <ListItemButton onClick={clickHandler(page)}>
            <ListItemIcon>{children}</ListItemIcon>
            <ListItemText primary={page} />
          </ListItemButton>
        </ListItem>
      );
    },
    [clickHandler, currentPage],
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
        <DrawerItem page="Site">
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
