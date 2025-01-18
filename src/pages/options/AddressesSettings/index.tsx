import { useCallback, useEffect, useState, useRef } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';
import { usePageTitle } from '@src/shared/contexts/PageTitleContext';

import LocalAddressBook from './LocalAddressBook';
import { Tour } from './Tour';

interface UnsavedChangesMap {
  [sectionId: string]: boolean;
}

export default function AddressesSettings() {
  const { setPageTitle } = usePageTitle();
  const [sections, setSections] = useState<Rolod0xAddressBookSection[]>([]);
  const [runTour, setRunTour] = useState(false);
  const unsavedChangesRef = useRef<UnsavedChangesMap>({});

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

  const hasUnsavedChanges = useCallback(() => {
    return Object.values(unsavedChangesRef.current).some(hasChanges => hasChanges);
  }, []);

  const updateUnsavedChanges = useCallback((sectionId: string, hasChanges: boolean) => {
    unsavedChangesRef.current[sectionId] = hasChanges;
  }, []);

  useEffect(() => {
    setPageTitle('address book');
  }, [setPageTitle]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  useEffect(() => {
    const handleOptionsReset = (_event: Event) => {
      if (hasUnsavedChanges()) {
        const shouldProceed = window.confirm(
          'You have unsaved changes. Resetting all options will lose these changes. Are you sure you want to proceed?',
        );
        if (!shouldProceed) {
          return;
        }
      }
      getOptions();
    };

    const handleDeleteSection = () => {
      getOptions();
    };

    window.addEventListener('options-reset', handleOptionsReset);
    window.addEventListener('delete-section', handleDeleteSection);

    return () => {
      window.removeEventListener('options-reset', handleOptionsReset);
      window.removeEventListener('delete-section', handleDeleteSection);
    };
  }, [getOptions, hasUnsavedChanges]);

  useEffect(() => {
    const checkTourState = async () => {
      const options = await optionsStorage.getAllDeserialized();
      if (!options.hasSeenTour) {
        setRunTour(true);
      }
    };
    checkTourState();
  }, []);

  return (
    <Box>
      <Tour runTour={runTour} onTourFinish={() => setRunTour(false)} />
      <Alert severity="warning" variant="outlined" sx={{ borderWidth: 3, mb: 3 }}>
        After changing entries in the address book, you may have to reload pages for the changes to
        take effect.
      </Alert>
      {sections.map((section, index) => (
        <LocalAddressBook
          key={section.id}
          sectionId={section.id}
          _index={index}
          onUnsavedChanges={updateUnsavedChanges}
        />
      ))}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button className="add-section-button" variant="contained" onClick={handleAddSection}>
          Add New Section
        </Button>
      </Box>
    </Box>
  );
}
