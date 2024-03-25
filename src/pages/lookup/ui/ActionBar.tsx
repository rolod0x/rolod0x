import React, { HTMLAttributes, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Autocomplete, { AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// import { Formatter } from '@src/shared/formatter';
import { IframeContext } from '@src/components/IframeModal';
import { Rolod0xOptions, optionsStorage } from '@src/shared/options-storage';
import { delayedFocusInput } from '@src/shared/focus';
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

export default function ActionBar() {
  const [items, setItems] = useState<ParsedEntries>([]);
  const textFieldRef = useRef(null);
  const { handleClose } = useContext(IframeContext);

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

  const focusTextField = useCallback(() => delayedFocusInput(textFieldRef), [textFieldRef]);

  useEffect(() => {
    async function _get(): Promise<void> {
      const parsed = await getLabels();
      setItems(parsed);
    }
    _get();

    focusTextField();

    window.addEventListener('message', function (event) {
      // console.log('rolod0x: ActionBar got message', event);
      if (
        // FIXME: Does this break other browsers?  Also, could we discover
        // the full origin to check against?
        // event.origin.startsWith('chrome-extension://') &&
        event.data === 'focus-input'
      ) {
        focusTextField();
        const textField = textFieldRef.current;
        textField.select();
      }
    });
  }, [getLabels, setItems, focusTextField]);

  const handleChange = useCallback(
    (
      _event: React.SyntheticEvent,
      value: AddressLabelComment,
      _reason: string,
      _details?: AutocompleteChangeDetails<AddressLabelComment>,
    ): void => {
      if (!value?.address) {
        // console.debug('rolod0x: handleChange without addr', _event, value, _reason, _details);
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
      // Uncomment for debugging via inspector
      // open={true}
      selectOnFocus={false}
      getOptionKey={option => option.address + ' ||| ' + option.label}
      id="action-bar"
      options={items}
      sx={{
        minWidth: 500,
      }}
      ListboxProps={{
        style: {
          maxHeight: '70vh',
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
