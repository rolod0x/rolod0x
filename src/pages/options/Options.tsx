import React, { useEffect, useState } from 'react';

import { parseLabels } from '../../shared/parser';
import { optionsStorage } from '../../shared/options-storage';
import '@pages/options/Options.css';

function OptionsForm() {
  const [labels, setLabels] = useState('');
  const [error, setError] = useState<string | null>();

  const validate = (labels: string): void => {
    if (!labels) return;

    try {
      console.log(`Parsing: ${labels.slice(0, 30)}...`);
      const [linesParsed, _labelMap] = parseLabels(labels);
      console.log(`Parsed ${linesParsed} lines`);
      setError(null);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleLabelsChange = async event => {
    setLabels(event.target.value);
    await optionsStorage.set({ labels: event.target.value });
    validate(event.target.value);
  };

  useEffect(() => {
    async function getOptions() {
      const options = await optionsStorage.getAll();
      console.log('Hydrated options from storage');
      setLabels(options.labels);
      validate(labels);
    }
    getOptions();
  });

  return (
    <form className="detail-view-container">
      <div title="Blockchain address labels">
        <p>Enter your address labels here, one on each line. Each entry should look something like</p>
        <pre>
          <code>0xaddress Label for address</code>
        </pre>
        <p>
          You can optionally add <code>{'// a comment'}</code> after the address to provide more information.
        </p>
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
      </div>
    </form>
  );
}

const Options: React.FC = () => {
  return (
    <div className="container">
      <OptionsForm />
    </div>
  );
};

export default Options;
