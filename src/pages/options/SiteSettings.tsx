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

function SiteItem(url: string, handleDelete: (string) => Promise<void>) {
  const primaryAction = (
    <Tooltip title="Delete this site from the allow list">
      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(url)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
  return (
    <ListItem key={url}>
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
  const [sites, setSites] = useState<string[]>([]);

  const fetchSites = useCallback(async () => {
    const manifestPermissions = await normalizeManifestPermissions();
    const newPermissions = await queryAdditionalPermissions();
    setSites([...manifestPermissions.origins, ...newPermissions.origins]);
  }, [setSites]);

  useEffect(() => {
    fetchSites();
  });

  const handleDelete = useCallback(
    async (url: string) => {
      console.log(`delete ${url}`);
      await chrome.permissions.remove({ origins: [url] });
      fetchSites();
    },
    [fetchSites],
  );

  const siteItems = sites.map(url => SiteItem(url, handleDelete));

  return (
    <Fragment>
      <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
        Allowed sites
      </Typography>
      <Typography paragraph>
        <Rolod0xText /> will only activate on the sites listed below:
      </Typography>
      <Typography>
        {sites.length > 0 ? (
          <List dense sx={{ maxWidth: 500 }}>
            {siteItems}
          </List>
        ) : (
          <Loading />
        )}
      </Typography>
    </Fragment>
  );
}
