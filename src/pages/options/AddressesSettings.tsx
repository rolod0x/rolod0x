import { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

import { useAddressBook } from '@src/shared/hooks/useAddressBook';

import LocalAddressBook from './LocalAddressBook';

export default function AddressesSettings() {
  const {
    labels,
    error,
    currentLabelsHash,
    savedLabelsHash,
    setLabels,
    setCurrentLabelsHash,
    handleSave,
    getOptions,
    validate,
  } = useAddressBook();

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return (
    <Box>
      <Alert severity="warning" variant="outlined" sx={{ borderWidth: 3 }}>
        After changing entries in the address book, you may have to reload pages for the changes to
        take effect.
      </Alert>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography variant="h4" component="h2">
            Local address book
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LocalAddressBook
            labels={labels}
            error={error}
            currentLabelsHash={currentLabelsHash}
            savedLabelsHash={savedLabelsHash}
            onLabelsChange={setLabels}
            onCurrentLabelsHashChange={setCurrentLabelsHash}
            onSave={handleSave}
            onGetOptions={getOptions}
            validate={validate}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
