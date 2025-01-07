import dedent from 'dedent';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Link, Typography, styled } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Joyride, { STATUS } from 'react-joyride';
import { tabs } from 'webextension-polyfill';

import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';
import Rolod0xText from '@root/src/components/Rolod0xText';
import { usePageTitle } from '@src/shared/contexts/PageTitleContext';

import StyledCode from '../shared/StyledCode';

import LocalAddressBook from './LocalAddressBook';

import type { CallBackProps, Step } from 'react-joyride';

const LeftTypography = styled(Typography)({
  marginBottom: 1,
  textAlign: 'left',
  paddingLeft: '20px',
});

const WelcomeMessage = () => (
  <>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
      Welcome to <Rolod0xText bold />!
    </Typography>
    <Typography>
      Let's give you a lightning quick tour to make sure you get the most enjoyable and useful
      experience from this extension.
    </Typography>
  </>
);

const getShortcutsUrl = (): string | null => {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  if (isFirefox) return 'about:addons';

  const isChromeBased = /chrome|chromium|brave/i.test(navigator.userAgent);
  if (isChromeBased) return 'chrome://extensions/shortcuts';

  return null;
};

const UsabilityHints = () => {
  const isMacOS = (() => {
    // @ts-expect-error userAgentData is not yet in the TypeScript types
    if (navigator.userAgentData?.platform) {
      // @ts-expect-error userAgentData is not yet in the TypeScript types
      return navigator.userAgentData.platform === 'macOS';
    }
    // Fallback for browsers that don't support userAgentData
    return /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
  })();
  const hotkey = isMacOS ? 'Shift+⌘+Space' : 'Shift+Alt+Space';

  const handleShortcutsClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const url = getShortcutsUrl();
    if (url) {
      tabs.create({ url });
    }
  };

  const shortcutsElement = (() => {
    const text = 'browser extension shortcuts settings';
    const url = getShortcutsUrl();
    return url ? (
      <Link href="#" onClick={handleShortcutsClick}>
        {text}
      </Link>
    ) : (
      text
    );
  })();

  return (
    <>
      <LeftTypography sx={{ mb: 1 }}>
        You may not even need to use this settings page most of the time!
      </LeftTypography>

      <LeftTypography>
        The following can be quicker and easier:
        <ul>
          <li>
            Label addresses by{' '}
            <Link
              href="https://rolod0x.io/docs/user-manual.html#adding"
              target="_blank"
              rel="noreferrer noopener">
              right‑clicking&nbsp;on&nbsp;them.
            </Link>
          </li>
          <li>
            <Link
              href="https://rolod0x.io/docs/user-manual.html#lookup"
              target="_blank"
              rel="noreferrer noopener">
              Quickly look up addresses via a hotkey
            </Link>
            &nbsp;— by default it's {hotkey}, but you can customize it in your {shortcutsElement}.
          </li>
        </ul>
      </LeftTypography>
    </>
  );
};

const tourSteps: Step[] = [
  {
    target: '.MuiBox-root',
    content: <WelcomeMessage />,
    disableBeacon: true,
    placement: 'center',
    styles: {
      options: {
        width: '500px',
      },
    },
  },
  {
    target: '.MuiBox-root',
    content: <UsabilityHints />,
    disableBeacon: true,
    placement: 'center',
    styles: {
      options: {
        width: '600px',
      },
    },
  },
  {
    target: '[data-joyride-target="codeMirror-editor"]',
    disableBeacon: true,
    styles: {
      options: {
        width: '800px',
      },
    },
    content: (
      <Box>
        <Typography>
          Your addresses and labels go here, one on each line. Each entry should look something
          like:
        </Typography>
        <Box p={2}>
          <StyledCode>
            0x6B175474E89094C44Da98b954EedeAC495271d0F My label for this address
          </StyledCode>
        </Box>
        <Typography>
          You can optionally add{' '}
          <StyledCode className="example-comment">{'//'} a comment</StyledCode> after the address to
          provide more information.
        </Typography>
      </Box>
    ),
  },
  {
    target: '.section-paste-button',
    content: dedent`
        Click here to paste addresses from the clipboard.
        This is useful for bulk import from a file.`,
    disableBeacon: true,
  },
  {
    target: '.add-section-button',
    disableBeacon: true,
    content: dedent`
      Click here to add a new section to your address book.
      For example, you could have one section for personal wallets, and one for work.`,
  },
  // {
  //   target: '.MuiAccordionSummary-expandIconWrapper',
  //   disableBeacon: true,
  //   content: 'When you have multiple sections, click here to expand or collapse a section.',
  // },
];

export default function AddressesSettings() {
  const { setPageTitle } = usePageTitle();
  const [sections, setSections] = useState<Rolod0xAddressBookSection[]>([]);
  const [runTour, setRunTour] = useState(false);

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getAllDeserialized();
    setSections(options.sections);
  }, []);

  const handleAddSection = useCallback(async () => {
    const newSection: Rolod0xAddressBookSection = {
      id: uuidv4(),
      title: 'New section',
      format: 'rolod0x',
      source: 'text',
      labels: '',
      url: '',
      expanded: true,
    };
    const updatedSections = [...sections, newSection];
    await optionsStorage.setDeserialized({ sections: updatedSections });
    setSections(updatedSections);
  }, [sections]);

  useEffect(() => {
    setPageTitle('address book');
  }, [setPageTitle]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  useEffect(() => {
    const handleOptionsReset = () => {
      getOptions();
    };

    window.addEventListener('options-reset', handleOptionsReset);

    return () => {
      window.removeEventListener('options-reset', handleOptionsReset);
    };
  }, [getOptions]);

  useEffect(() => {
    const checkTourState = async () => {
      const options = await optionsStorage.getAllDeserialized();
      if (!options.hasSeenTour) {
        setRunTour(true);
      }
    };
    checkTourState();
  }, []);

  const handleJoyrideCallback = useCallback(async (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      await optionsStorage.set({ hasSeenTour: true });
    }
  }, []);

  return (
    <Box>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        disableScrolling={false}
        callback={handleJoyrideCallback}
        locale={{ last: 'Finish' }}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#1976d2',
          },
        }}
      />
      {/* <Alert
        severity="info"
        sx={{
          borderWidth: 3,
          mb: 1,
          '& .MuiAlert-icon': {
            marginTop: '4px',
          },
        }}>
        <UsabilityHints />
      </Alert> */}
      <Alert severity="warning" variant="outlined" sx={{ borderWidth: 3, mb: 3 }}>
        After changing entries in the address book, you may have to reload pages for the changes to
        take effect.
      </Alert>
      {sections.map((section, index) => (
        <LocalAddressBook key={section.id} sectionId={section.id} index={index} />
      ))}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button className="add-section-button" variant="contained" onClick={handleAddSection}>
          Add New Section
        </Button>
      </Box>
    </Box>
  );
}
