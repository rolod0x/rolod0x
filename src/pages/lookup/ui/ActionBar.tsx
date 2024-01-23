import { useCallback, useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { useCombobox } from 'downshift';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Formatter } from '../../../shared/formatter';
import { Rolod0xOptions, optionsStorage } from '../../../shared/options-storage';
import { ParsedEntries } from '../../../shared/types';
import { Parser, ParseError } from '../../../shared/parser';

const itemFormatter = new Formatter('%n (%a)');

function itemToString(item): string {
  return item ? itemFormatter.format(item.label, item.address) : '';
}

function getFilter(inputValue) {
  const lowerCasedWords = inputValue.toLowerCase().split(/\s+/);

  return function _itemFilter(item) {
    // Show all items if no search terms provided
    if (!inputValue) return true;

    // Require each search term to match a substring of either the label or the address.
    for (const word of lowerCasedWords) {
      if (!item.label.toLowerCase().includes(word) && !item.address.toLowerCase().includes(word)) {
        return false;
      }
    }
    return true;
  };
}

export default function ActionBar() {
  const [labels, setLabels] = useState<ParsedEntries>([]);
  const [items, setItems] = useState<ParsedEntries>([]);

  const getLabels = useCallback(async (): Promise<ParsedEntries> => {
    const options: Rolod0xOptions = await optionsStorage.getAll();
    const parser = new Parser();
    try {
      parser.parseMultiline(options.labels);
      setLabels(parser.parsedEntries);
      return parser.parsedEntries;
    } catch (err: unknown) {
      if (err instanceof ParseError) {
        console.log('rolod0x:', err);
      } else {
        console.error('rolod0x:', err);
      }
    }
  }, [setLabels]);

  useEffect(() => {
    async function _get(): Promise<void> {
      const parsed = await getLabels();
      setItems(parsed);
    }

    _get();
  }, [getLabels, setItems]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(labels.filter(getFilter(inputValue)));
    },
    items,
    itemToString,
  });

  return (
    <Container id="actionBar">
      <div className="w-72 flex flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Search for an address book entry:
          <div className="flex shadow-sm bg-white gap-0.5">
            <input placeholder="Label or address" className="w-full p-1.5" {...getInputProps()} />
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}>
              {isOpen ? <>&#8593;</> : <>&#8595;</>}
            </button>
          </div>
        </label>
      </div>
      <ul
        className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && 'hidden'
        }`}
        {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && 'bg-blue-300',
                selectedItem === item && 'font-bold',
                'py-2 px-3 shadow-sm flex flex-col',
              )}
              key={itemToString(item)}
              {...getItemProps({ item, index })}>
              <span>{item.label}</span>
              <span className="text-sm text-gray-700">{item.address}</span>
            </li>
          ))}
      </ul>
    </Container>
  );
}
