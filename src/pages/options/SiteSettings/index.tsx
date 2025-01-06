import { Fragment, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import PublicIcon from '@mui/icons-material/Public';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import 'webextension-polyfill';
import { queryAdditionalPermissions, normalizeManifestPermissions } from 'webext-permissions';

import { usePageTitle } from '@root/src/shared/contexts/PageTitleContext';
import Loading from '@src/components/Loading';
import Rolod0xText from '@src/components/Rolod0xText';

import SettingsAccordionSection from '../shared/SettingsAccordionSection';
import SettingsPageHeader from '../shared/SettingsPageHeader';

const StyledTextField = styled(TextField)(`
  .MuiOutlinedInput-input {
    padding: 5px 10px;
    width: 500px;
  }
`);

function ManifestSiteItem(url: string) {
  const dummyAction = <DeleteIcon sx={{ color: '#0000' }} />;
  return (
    <ListItem key={url} sx={{ pl: 0 }}>
      <ListItemIcon sx={{ minWidth: 45 }}>{dummyAction}</ListItemIcon>
      <StyledTextField
        variant="outlined"
        disabled
        defaultValue={url}
        InputProps={{
          readOnly: true,
        }}
      />
    </ListItem>
  );
}

function AdditionalSiteItem(url: string, handleDelete: (string) => Promise<void>) {
  const primaryAction = (
    <Tooltip title="Delete this site from the allow list">
      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(url)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
  return (
    <ListItem key={url} sx={{ pl: 0 }}>
      <ListItemIcon sx={{ minWidth: 45 }}>{primaryAction}</ListItemIcon>
      <StyledTextField
        variant="outlined"
        defaultValue={url}
        InputProps={{
          readOnly: true,
        }}
      />
    </ListItem>
  );
}

export default function SiteSettings() {
  const [manifestSites, setManifestSites] = useState<string[] | null>(null);
  const [additionalSites, setAdditionalSites] = useState<string[] | null>(null);
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('site settings');
  }, [setPageTitle]);

  const fetchSites = useCallback(async () => {
    const manifestPermissions = normalizeManifestPermissions();
    setManifestSites([...manifestPermissions.origins]);

    const newPermissions = await queryAdditionalPermissions();
    setAdditionalSites([...newPermissions.origins]);
  }, [setManifestSites, setAdditionalSites]);

  useEffect(() => {
    fetchSites();
    chrome.permissions.onAdded.addListener(() => fetchSites());
    chrome.permissions.onRemoved.addListener(() => fetchSites());
  }, [fetchSites]);

  const handleDelete = useCallback(
    async (url: string) => {
      console.log(`delete ${url}`);
      await chrome.permissions.remove({ origins: [url] });
      fetchSites();
    },
    [fetchSites],
  );

  const manifestSiteItems = manifestSites?.map(url => ManifestSiteItem(url));
  const additionalSiteItems = additionalSites?.map(url => AdditionalSiteItem(url, handleDelete));

  const AdditionalSites = () => {
    if (!additionalSites) {
      return <Loading />;
    }

    return (
      <Fragment>
        {additionalSites.length == 0 && (
          <Typography paragraph>No additional sites are allowed yet.</Typography>
        )}

        <Typography paragraph>
          You can enable a site by right-clicking on the extension icon, and selecting the option
          "Enable rolod0x on this domain".
        </Typography>
        {additionalSites.length > 0 && (
          <List dense sx={{ maxWidth: 500 }}>
            {additionalSiteItems}
          </List>
        )}
      </Fragment>
    );
  };

  return (
    <Fragment>
      <SettingsPageHeader title="Allowed sites" />

      <Typography paragraph>
        <Rolod0xText /> will only activate on the sites listed below.
      </Typography>

      <SettingsAccordionSection title="Your sites">
        <AdditionalSites />
      </SettingsAccordionSection>

      <SettingsAccordionSection title="Built-in sites">
        <Typography paragraph>
          These are automatically enabled by rolod0x and cannot be disabled (yet, but{' '}
          <Link
            href="https://github.com/rolod0x/rolod0x/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer noopener">
            let us know
          </Link>{' '}
          if this is an issue for you).
        </Typography>
        {manifestSites ? (
          <List dense sx={{ maxWidth: 500 }}>
            {manifestSiteItems}
          </List>
        ) : (
          <Loading />
        )}
      </SettingsAccordionSection>
    </Fragment>
  );
}
