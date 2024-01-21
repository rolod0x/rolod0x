import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../../shared/theme';

import ResponsiveDrawer from './ResponsiveDrawer';
import AddressesSettings from './AddressesSettings';
import DisplaySettings from './DisplaySettings';
import Donate from './Donate';
import SiteSettings from './SiteSettings';

export default function Options() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        <Route path="/" element={<ResponsiveDrawer />}>
          <Route index element={<AddressesSettings />} />
          <Route path="Addresses" element={<AddressesSettings />} />
          <Route path="Display" element={<DisplaySettings />} />
          <Route path="Sites" element={<SiteSettings />} />
          <Route path="Donate" element={<Donate />} />
          <Route path="*" element={<AddressesSettings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
