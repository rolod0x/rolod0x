import { useCallback, useState } from 'react';
import * as murmurhash from 'murmurhash';

import '@src/shared/console';
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
  const [expanded, setExpanded] = useState(true);

  const validate = useCallback(
    (labels: string): void => {
      if (!labels) return;

      try {
        console.llog(`Parsing: ${labels.slice(0, 30)}...`);
        const parser = new Parser(labels);
        console.llog(`Parsed ${parser.parsedEntries.length} entries`);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof ParseError) {
          console.llog(err.message);
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
      expanded,
    };
    await optionsStorage.setSection(sectionId, updatedSection);
    const hash = murmurhash.v3(labels);
    setSavedLabelsHash(hash);
    validate(labels);
  }, [sectionId, title, labels, url, validate, expanded]);

  const getSection = useCallback(async () => {
    let section;
    try {
      section = await optionsStorage.getSection(sectionId);
    } catch (error) {
      console.warn(`Error from getSection(${sectionId}):`, error);
    }

    if (!section) {
      console.warn(`Section ${sectionId} not found; it was likely deleted`);
      setIsLoaded(false);
      return;
    }

    setLabels(section.labels);
    setTitle(section.title);
    setUrl(section.url);
    setExpanded(section.expanded);
    const hash = murmurhash.v3(section.labels);
    console.llog(`Hydrated options from storage (hash ${hash})`);
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

  const updateExpanded = useCallback(
    (newExpanded: boolean) => updateSectionField('expanded', newExpanded, setExpanded),
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
    expanded,
    updateExpanded,
  };
}
