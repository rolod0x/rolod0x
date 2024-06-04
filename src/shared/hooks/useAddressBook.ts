import { useCallback, useState } from 'react';
import * as murmurhash from 'murmurhash';

import { Parser, ParseError } from '@src/shared/parser';
import { optionsStorage } from '@src/shared/options-storage';

export function useAddressBook() {
  const [labels, setLabels] = useState('');
  const [currentLabelsHash, setCurrentLabelsHash] = useState(murmurhash.v3(''));
  const [savedLabelsHash, setSavedLabelsHash] = useState(murmurhash.v3(''));
  const [error, setError] = useState<string | null>();

  const validate = useCallback(
    (labels: string): void => {
      if (!labels) return;

      try {
        console.log(`Parsing: ${labels.slice(0, 30)}...`);
        const parser = new Parser(labels);
        console.log(`Parsed ${parser.parsedEntries.length} entries`);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof ParseError) {
          console.log(err.message);
          setError(`Please check that line ${err.lineNumber} is in the correct format.`);
        } else if (err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        } else {
          console.error(err);
        }
      }
    },
    [setError],
  );

  const handleSave = useCallback(async () => {
    const section = await optionsStorage.getSection();
    const uuid = section.id;
    await optionsStorage.setSection(uuid, { labels });
    const hash = murmurhash.v3(labels);
    setSavedLabelsHash(hash);
    validate(labels);
  }, [labels, validate]);

  const getOptions = useCallback(async () => {
    const options = await optionsStorage.getSection();
    if (!options) {
      throw new Error('No options found');
    }
    setLabels(options.labels);
    const hash = murmurhash.v3(options.labels);
    console.log(`Hydrated options from storage (hash ${hash})`);
    setCurrentLabelsHash(hash);
    setSavedLabelsHash(hash);
    validate(options.labels);
  }, [setLabels, validate]);

  return {
    labels,
    error,
    currentLabelsHash,
    savedLabelsHash,
    setLabels,
    setCurrentLabelsHash,
    handleSave,
    getOptions,
    validate,
  };
}
