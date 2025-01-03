import { useCallback, useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';

import LocalAddressBook from './LocalAddressBook';

export default function AddressesSettings() {
  const [sections, setSections] = useState<Rolod0xAddressBookSection[]>([]);

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getAllDeserialized();
    setSections(options.sections);
  }, []);

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
      {sections.map(section => (
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
            <LocalAddressBook sectionId={section.id} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
