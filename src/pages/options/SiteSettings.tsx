import { Fragment, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import PublicIcon from '@mui/icons-material/Public';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import 'webextension-polyfill';
import { queryAdditionalPermissions, normalizeManifestPermissions } from 'webext-permissions';

import Rolod0xText from '../../components/Rolod0xText';

import SettingsSection from './SettingsSection';

export function Loading() {
  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
      <CircularProgress />
      <Box>Loading sites ...</Box>
    </Stack>
  );
}

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

  const fetchSites = useCallback(async () => {
    const manifestPermissions = await normalizeManifestPermissions();
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
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Allowed sites
      </Typography>
      <Typography paragraph>
        <Rolod0xText /> will only activate on the sites listed below.
      </Typography>

      <SettingsSection title="Your sites">
        <AdditionalSites />
      </SettingsSection>

      <SettingsSection title="Built-in sites">
        <Typography paragraph>
          These are automatically enabled by rolod0x and cannot be disabled (yet, but{' '}
          <a
            href="https://github.com/aspiers/rolod0x/blob/main/CONTRIBUTING.md"
            target="_noblank"
            rel="noreferrer noopener">
            let us know
          </a>{' '}
          if this is an issue for you).
        </Typography>
        {manifestSites ? (
          <List dense sx={{ maxWidth: 500 }}>
            {manifestSiteItems}
          </List>
        ) : (
          <Loading />
        )}
      </SettingsSection>
    </Fragment>
  );
}
