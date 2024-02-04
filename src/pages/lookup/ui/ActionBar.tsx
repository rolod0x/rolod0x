import React, { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import Autocomplete, { AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// import { Formatter } from '@src/shared/formatter';
import { Rolod0xOptions, optionsStorage } from '@src/shared/options-storage';
import { AddressLabelComment, ParsedEntries } from '@src/shared/types';
import { Parser, ParseError } from '@src/shared/parser';
// import Loading from '@src/components/Loading';

import { itemsFilter } from './search';
import AddressOption from './AddressOption';

// const itemFormatter = new Formatter('%n (%a)');
//
// function itemToString(item): string {
//   return item ? itemFormatter.format(item.label, item.address) : '';
// }

interface Props {
  handleClose: () => void;
}

export default function ActionBar({ handleClose }: Props) {
  const [items, setItems] = useState<ParsedEntries>([]);
  const textFieldRef = useRef(null);

  const getLabels = useCallback(async (): Promise<ParsedEntries> => {
    const options: Rolod0xOptions = await optionsStorage.getAll();
    const parser = new Parser();
    try {
      parser.parseMultiline(options.labels);
      return parser.parsedEntries;
    } catch (err: unknown) {
      if (err instanceof ParseError) {
        console.log('rolod0x:', err);
      } else {
        console.error('rolod0x:', err);
      }
    }
  }, []);

  const focusInput = useCallback(() => {
    const textField = textFieldRef.current;
    if (!textField) return; // It might not be rendered yet.
    // console.log('textField: ', textField);
    textField.focus();
    textField.click();
    textField.focus();
    // const input = textField.querySelector('#action-bar');
    // if (!input) {
    //   console.warn("rolod0x: Couldn't find #action-bar input to focus");
    //   return;
    // }
    // input.focus();
    // console.debug('focused', textField);
  }, [textFieldRef]);

  useEffect(() => {
    async function _get(): Promise<void> {
      const parsed = await getLabels();
      setItems(parsed);
    }
    _get();

    focusInput();

    window.addEventListener('message', function (event) {
      // console.log('ActionBar got message', event);
      if (
        // FIXME: Does this break other browsers?  Also, could we discover
        // the full origin to check against?
        // event.origin.startsWith('chrome-extension://') &&
        event.data === 'focus-input'
      ) {
        focusInput();
      }
    });
  }, [getLabels, setItems, focusInput]);

  const handleChange = useCallback(
    (
      _event: React.SyntheticEvent,
      value: AddressLabelComment,
      _reason: string,
      _details?: AutocompleteChangeDetails<AddressLabelComment>,
    ): void => {
      if (!value?.address) {
        console.log('handleChange without addr', _event, value, _reason, _details);
        return;
      }

      // This requires allow="clipboard-write" in the containing <iframe>
      window.navigator.clipboard.writeText(value.address);
      console.log(`rolod0x: Copied '${value.address}' to clipboard from ${value.label}`);
      textFieldRef.current.value = '';
      handleClose();
    },
    [handleClose],
  );

  /* eslint-disable jsx-a11y/no-autofocus */
  return (
    <Autocomplete
      autoFocus
      autoHighlight
      clearOnBlur={false}
      clearOnEscape={false}
      selectOnFocus={false}
      getOptionKey={option => option.address + ' ||| ' + option.label}
      id="action-bar"
      options={items}
      sx={{
        minWidth: 500,
      }}
      ListboxProps={{
        style: {
          maxHeight: '75vh',
        },
      }}
      filterOptions={itemsFilter}
      loading={items.length == 0}
      onChange={handleChange}
      // This would break Escape closing the dropdown and then a second escape
      // closing the modal:
      // open={true}
      renderInput={params => <TextField {...params} inputRef={textFieldRef} label="Search terms" />}
      renderOption={(props: HTMLAttributes<HTMLLIElement>, option: AddressLabelComment) => (
        <AddressOption {...{ props }} {...{ option }} />
      )}
    />
  );
}
