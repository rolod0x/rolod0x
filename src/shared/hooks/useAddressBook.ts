import { useCallback, useState } from 'react';
import * as murmurhash from 'murmurhash';

import { Parser, ParseError } from '@src/shared/parser';
import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';

export function useAddressBook(sectionId: string) {
  const [labels, setLabels] = useState('');
  const [title, setTitle] = useState('');
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
    const updatedSection: Rolod0xAddressBookSection = {
      id: sectionId,
      title,
      format: 'rolod0x',
      source: 'text',
      labels,
    };
    await optionsStorage.setSection(sectionId, updatedSection);
    const hash = murmurhash.v3(labels);
    setSavedLabelsHash(hash);
    validate(labels);
  }, [sectionId, title, labels, validate]);

  const getSection = useCallback(async () => {
    const section = await optionsStorage.getSection(sectionId);
    if (!section) {
      throw new Error(`Section with id ${sectionId} not found`);
    }
    setLabels(section.labels);
    setTitle(section.title);
    const hash = murmurhash.v3(section.labels);
    console.log(`Hydrated options from storage (hash ${hash})`);
    setCurrentLabelsHash(hash);
    setSavedLabelsHash(hash);
    validate(section.labels);
  }, [sectionId, validate]);

  return {
    labels,
    title,
    error,
    currentLabelsHash,
    savedLabelsHash,
    setLabels,
    setTitle,
    setCurrentLabelsHash,
    handleSave,
    getSection,
    validate,
  };
}
