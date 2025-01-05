import { useCallback, useState } from 'react';
import * as murmurhash from 'murmurhash';

import { Parser, ParseError } from '@src/shared/parser';
import { optionsStorage, Rolod0xAddressBookSection } from '@src/shared/options-storage';

export function useAddressBook(sectionId: string) {
  const [labels, setLabels] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [currentLabelsHash, setCurrentLabelsHash] = useState(murmurhash.v3(''));
  const [savedLabelsHash, setSavedLabelsHash] = useState(murmurhash.v3(''));
  const [error, setError] = useState<string | null>();
  const [isLoaded, setIsLoaded] = useState(false);

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
      url,
    };
    await optionsStorage.setSection(sectionId, updatedSection);
    const hash = murmurhash.v3(labels);
    setSavedLabelsHash(hash);
    validate(labels);
  }, [sectionId, title, labels, url, validate]);

  const getSection = useCallback(async () => {
    const section = await optionsStorage.getSection(sectionId);
    if (!section) {
      throw new Error(`Section with id ${sectionId} not found`);
    }
    setLabels(section.labels);
    setTitle(section.title);
    setUrl(section.url);
    const hash = murmurhash.v3(section.labels);
    console.log(`Hydrated options from storage (hash ${hash})`);
    setCurrentLabelsHash(hash);
    setSavedLabelsHash(hash);
    validate(section.labels);
    setIsLoaded(true);
  }, [sectionId, validate]);

  const updateSectionField = useCallback(
    async <T extends keyof Rolod0xAddressBookSection>(
      field: T,
      value: Rolod0xAddressBookSection[T],
      setter: (value: Rolod0xAddressBookSection[T]) => void,
    ) => {
      const section = await optionsStorage.getSection(sectionId);
      if (!section) {
        throw new Error(`Section with id ${sectionId} not found`);
      }
      const updatedSection: Rolod0xAddressBookSection = {
        ...section,
        [field]: value,
      };
      await optionsStorage.setSection(sectionId, updatedSection);
      setter(value);
    },
    [sectionId],
  );

  const updateTitle = useCallback(
    (newTitle: string) => updateSectionField('title', newTitle, setTitle),
    [updateSectionField],
  );

  const updateUrl = useCallback(
    (newUrl: string) => updateSectionField('url', newUrl, setUrl),
    [updateSectionField],
  );

  const deleteSection = useCallback(async () => {
    await optionsStorage.deleteSection(sectionId);
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('section-deleted', { detail: { sectionId } }));
  }, [sectionId]);

  return {
    labels,
    title,
    url,
    error,
    currentLabelsHash,
    savedLabelsHash,
    setLabels,
    setTitle,
    setCurrentLabelsHash,
    handleSave,
    getSection,
    isLoaded,
    validate,
    updateTitle,
    updateUrl,
    deleteSection,
  };
}