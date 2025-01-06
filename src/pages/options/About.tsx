import { useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';

import Rolod0xText from '@root/src/components/Rolod0xText';
import { usePageTitle } from '@root/src/shared/contexts/PageTitleContext';

const About = () => {
  const manifest = chrome.runtime.getManifest();
  const { setPageTitle } = usePageTitle();
  useEffect(() => {
    setPageTitle(
      <>
        About <Rolod0xText bold />
      </>,
    );
  }, [setPageTitle]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography paragraph>Version {manifest.version}</Typography>

      <Typography paragraph>
        <Rolod0xText /> is an Open Source private onchain address book, built as a browser
        extension. It helps you manage and identify blockchain addresses across different websites.
      </Typography>

      <Typography paragraph>
        For more information, visit{' '}
        <Link href="https://rolod0x.io" target="_blank" rel="noopener noreferrer">
          rolod0x.io
        </Link>
        .
      </Typography>

      <Typography paragraph>
        This software is open source and available under the{' '}
        <Link href="https://rolod0x.io/#license" target="_blank" rel="noopener noreferrer">
          GPL-3.0 license
        </Link>
        . View the source code on{' '}
        <Link href="https://github.com/rolod0x/rolod0x" target="_blank" rel="noopener noreferrer">
          GitHub
        </Link>
        .
      </Typography>
    </Box>
  );
};

export default About;
