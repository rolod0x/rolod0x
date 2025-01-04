import { Routes, Route } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';

import withSuspense from '@src/shared/hoc/withSuspense';
import ErrorPage from '@src/components/ErrorPage';
import Rolod0xThemeProvider from '@src/components/Rolod0xThemeProvider';

import ResponsiveDrawer from './ResponsiveDrawer';
import AddressesSettings from './AddressesSettings';
import DisplaySettings from './DisplaySettings';
import Donate from './Donate';
import SiteSettings from './SiteSettings';
import RawOptionsDialog from './RawOptionsDialog';
import Help from './Help';

const Options = () => {
  return (
    <Rolod0xThemeProvider>
      <RawOptionsDialog />
      <Routes>
        <Route path="/" element={<ResponsiveDrawer />}>
          <Route index element={<AddressesSettings />} />
          <Route path="Addresses" element={<AddressesSettings />} />
          <Route path="Display" element={<DisplaySettings />} />
          <Route path="Sites" element={<SiteSettings />} />
          <Route path="Donate" element={<Donate />} />
          <Route path="Help" element={<Help />} />
          <Route path="*" element={<AddressesSettings />} />
        </Route>
      </Routes>
    </Rolod0xThemeProvider>
  );
};

export default withErrorBoundary(withSuspense(Options, <h1> Loading rolod0x option... </h1>), {
  fallbackRender: ({ error }) => <ErrorPage error={error} />,
});
