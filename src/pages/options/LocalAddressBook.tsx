import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

import { parseLabels } from '../../shared/parser';
import { optionsStorage } from '../../shared/options-storage';

export default function LocalAddressBook() {
  const [labels, setLabels] = useState('');
  const [error, setError] = useState<string | null>();

  const validate = useCallback(
    (labels: string): void => {
      if (!labels) return;

      try {
        console.log(`Parsing: ${labels.slice(0, 30)}...`);
        const [linesParsed, _labelMap] = parseLabels(labels);
        console.log(`Parsed ${linesParsed} lines`);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    },
    [setError],
  );

  const handleLabelsChange = useCallback(
    async event => {
      setLabels(event.target.value);
      await optionsStorage.set({ labels: event.target.value });
      validate(event.target.value);
    },
    [setLabels, validate],
  );

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getAll();
    console.log('Hydrated options from storage');
    setLabels(options.labels);
    validate(labels);
  }, [labels, setLabels, validate]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return (
    <form className="detail-view-container">
      <Typography>Enter your address labels here, one on each line. Each entry should look something like:</Typography>
      <Box sx={{ p: 2, fontFamily: 'Monospace' }}>
        <code>0xaddress Label for address</code>
      </Box>
      <Typography>
        You can optionally add <code>{'// a comment'}</code> after the address to provide more information.
      </Typography>
      <div id="parser-error" style={{ display: error ? 'block' : 'none' }}>
        {error}
      </div>
      <textarea
        name="labels"
        rows={40}
        cols={120}
        value={labels}
        onChange={handleLabelsChange}
        spellCheck="false"
        placeholder="0x6B175474E89094C44Da98b954EedeAC495271d0F DAI    // Dai Stablecoin"></textarea>
    </form>
  );
}
