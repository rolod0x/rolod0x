import dedent from 'dedent';
import { Box, Link, Typography, styled } from '@mui/material';
import { tabs } from 'webextension-polyfill';
import Joyride, { STATUS } from 'react-joyride';

import { optionsStorage } from '@src/shared/options-storage';
import Rolod0xText from '@root/src/components/Rolod0xText';

import StyledCode from '../shared/StyledCode';

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
        Here is the quickest and easiest way to use <Rolod0xText />:
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
              Quickly look up addresses via a keyboard shortcut
            </Link>
            &nbsp;— by default it's {hotkey}, but you can customize it in your {shortcutsElement}.
          </li>
        </ul>
      </LeftTypography>
    </>
  );
};

export const tourSteps: Step[] = [
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
        <LeftTypography>
          Your addresses and labels go here, one on each line. Each entry should look something
          like:
        </LeftTypography>
        <Box p={2}>
          <StyledCode>
            0x6B175474E89094C44Da98b954EedeAC495271d0F My label for this address
          </StyledCode>
        </Box>
        <LeftTypography>
          You can optionally add{' '}
          <StyledCode className="example-comment">{'//'} a comment</StyledCode> after the address to
          provide more information.
        </LeftTypography>
      </Box>
    ),
  },
  {
    target: '.display-navlink',
    disableBeacon: true,
    styles: {
      options: {
        width: '800px',
      },
    },
    content: (
      <Box>
        <LeftTypography paragraph>
          When <Rolod0xText /> detects an <em>abbreviated</em> address, it will try to guess what
          the address corresponds to. For example, if your address book has an entry for
        </LeftTypography>
        <Box p={2}>
          <StyledCode>0x186bA87Ee6C3B4B25318c0f521C45b482d7f2dC3</StyledCode>
        </Box>
        <LeftTypography paragraph>
          then if <Rolod0xText /> detects a string like <StyledCode>0x186b...2dC3</StyledCode> in a
          webpage, it will guess with high confidence that it's referring to the entry in your
          address book.
        </LeftTypography>
        <LeftTypography paragraph sx={{ mt: 1 }}>
          However, there's still a small chance this guess could be wrong, so to make this clear,
          guesses are displayed like this:
        </LeftTypography>
        <Box p={2}>
          <StyledCode>? some label ? (0x186b...2d7f)</StyledCode>
        </Box>
        <LeftTypography paragraph>
          You can change the way these guesses (and non-guesses) are displayed in the Display
          section.
        </LeftTypography>
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
  {
    target: '.help-navlink',
    disableBeacon: true,
    content: `That's it! You can revisit this tour at any time by clicking the "Restart Tour" button in this Help section.`,
  },
];

interface AddressBookTourProps {
  runTour: boolean;
  onTourFinish: () => void;
}

export const Tour = ({ runTour, onTourFinish }: AddressBookTourProps) => {
  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      await optionsStorage.set({ hasSeenTour: true });
      onTourFinish();
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous
      hideCloseButton
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
  );
};
