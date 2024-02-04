import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { withErrorBoundary } from 'react-error-boundary';

import { theme } from '@src/shared/theme';
import withSuspense from '@src/shared/hoc/withSuspense';
import ErrorPage from '@src/components/ErrorPage';

import ResponsiveDrawer from './ResponsiveDrawer';
import AddressesSettings from './AddressesSettings';
import DisplaySettings from './DisplaySettings';
import Donate from './Donate';
import SiteSettings from './SiteSettings';

const Options = () => {
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
};

export default withErrorBoundary(withSuspense(Options, <h1> Loading rolod0x option... </h1>), {
  fallbackRender: ({ error }) => <ErrorPage error={error} />,
});
