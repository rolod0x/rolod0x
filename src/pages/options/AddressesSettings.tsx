import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';
import Joyride from 'react-joyride';

import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';

import LocalAddressBook from './LocalAddressBook';

import type { Step } from 'react-joyride';

const tourSteps: Step[] = [
  {
    target: '.add-section-button',
    content: 'Click here to add a new section to your address book.',
  },
  {
    target: '.accordion-summary',
    content: 'Click here to expand or collapse a section.',
  },
  // Add more steps as needed
];

export default function AddressesSettings() {
  const [sections, setSections] = useState<Rolod0xAddressBookSection[]>([]);
  const [runTour, setRunTour] = useState(false);

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getAllDeserialized();
    setSections(options.sections);
  }, []);

  const handleAddSection = useCallback(async () => {
    const newSection: Rolod0xAddressBookSection = {
      id: uuidv4(),
      title: 'New Section',
      format: 'rolod0x',
      source: 'text',
      labels: '',
    };
    const updatedSections = [...sections, newSection];
    await optionsStorage.setDeserialized({ sections: updatedSections });
    setSections(updatedSections);
  }, [sections]);

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
        await optionsStorage.setDeserialized({ hasSeenTour: true });
      }
    };
    checkTourState();
  }, []);

  return (
    <Box>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <Alert
        severity="info"
        sx={{
          borderWidth: 3,
          mb: 1,
          '& .MuiAlert-icon': {
            marginTop: '4px',
          },
        }}>
        <Typography variant="h6" sx={{ mt: 0 }}>
          Did you know?
        </Typography>
        You can also label addresses simply by{' '}
        <Link
          href="https://rolod0x.io/docs/user-manual.html#adding"
          target="_noblank"
          rel="noreferrer noopener">
          right-clicking on them
        </Link>
        , and you can{' '}
        <Link
          href="https://rolod0x.io/docs/user-manual.html#lookup"
          target="_noblank"
          rel="noreferrer noopener">
          quickly look up addresses via a hotkey or by clicking the extension icon
        </Link>
        .
      </Alert>
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
