import { useCallback, useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';

import LocalAddressBook from './LocalAddressBook';

export default function AddressesSettings() {
  const [sections, setSections] = useState<Rolod0xAddressBookSection[]>([]);

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

  return (
    <Box>
      <Alert severity="warning" variant="outlined" sx={{ borderWidth: 3 }}>
        After changing entries in the address book, you may have to reload pages for the changes to
        take effect.
      </Alert>
      {sections.map((section, index) => (
        <Accordion key={section.id} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${section.id}-content`}
            id={`panel-${section.id}-header`}>
            <Typography variant="h4" component="h2" title="Click to expand/collapse">
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LocalAddressBook sectionId={section.id} index={index} />
          </AccordionDetails>
        </Accordion>
      ))}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={handleAddSection}>
          Add New Section
        </Button>
      </Box>
    </Box>
  );
}
