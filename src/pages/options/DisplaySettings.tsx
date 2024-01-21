import { Fragment } from 'react';
import Typography from '@mui/material/Typography';

import Rolod0xText from '../../components/Rolod0xText';

import SettingsPageHeader from './SettingsPageHeader';
import SettingsSection from './SettingsSection';

export default function DisplaySettings() {
  return (
    <Fragment>
      <SettingsPageHeader title="Display settings" />

      <SettingsSection title="Labelled address format">
        <Typography paragraph>
          Here you can configure how labels are displayed when <Rolod0xText /> uses them to replace
          raw addresses.
        </Typography>
      </SettingsSection>
    </Fragment>
  );
}
