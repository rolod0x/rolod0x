import React, { HTMLAttributes, useCallback, useContext, useEffect, useState } from 'react';
import { DialogContentText } from '@mui/material';

import { IframeContext } from '@src/components/IframeModal';
import { getParser } from '@src/shared/address-book';
import { optionsStorage, Rolod0xOptionsDeserialized } from '@src/shared/options-storage';
import { AddressLabel, AddressLabelComment, ParsedEntries } from '@src/shared/types';

import { addressBookItemsFilter } from './search';
import ActionsChooser from './ActionChooser';
import AddressOption from './AddressOption';
import FocusedAutocomplete from './FocusedAutocomplete';

export default function AddressChooser() {
  const [items, setItems] = useState<ParsedEntries | null>(null);
  const [selectedItem, setSelectedItem] = useState<AddressLabel | null>(null);
  const [actionChooserVisible, setActionChooserVisible] = useState(false);
  const { handleClose: closeIframe } = useContext(IframeContext);

  const getLabels = useCallback(async (): Promise<ParsedEntries> => {
    const options: Rolod0xOptionsDeserialized = await optionsStorage.getAllDeserialized();
    const parser = getParser(options);
    return parser.parsedEntries;
  }, []);

  useEffect(() => {
    async function _get(): Promise<void> {
      const parsed = await getLabels();
      setItems(parsed);
    }
    _get();
  }, [getLabels, setItems]);

  const handleAddressSelected = useCallback(
    (_event: React.SyntheticEvent, value: AddressLabelComment | null) => {
      if (!value?.address) {
        // console.debug('rolod0x: handleChange without addr', _event, value, _reason, _details);
        return;
      }

      setSelectedItem({
        address: value.address,
        label: value.label,
      });
      setActionChooserVisible(true);
    },
    [],
  );

  const handleClose = useCallback(
    (_event: React.SyntheticEvent, reason: string) => {
      if (reason === 'blur') return;
      if (reason !== 'selectOption') {
        setSelectedItem(null);
        closeIframe();
      }
    },
    [closeIframe],
  );

  const handleActionsClose = useCallback(
    (_event: React.SyntheticEvent, reason: string) => {
      if (reason === 'blur') return;
      if (reason === 'selectOption') {
        closeIframe();
        return;
      }
      setActionChooserVisible(false);
    },
    [closeIframe],
  );

  const addressChooser = (
    <>
      <DialogContentText sx={{ pb: 2 }}>
        Enter one or more search terms, space-separated:
      </DialogContentText>
      <FocusedAutocomplete<AddressLabelComment, false, false, false>
        id="address-chooser"
        // This would break Escape closing the dropdown and then a second escape
        // closing the modal:
        // open={true}
        // However it _is_ useful for debugging.
        options={items}
        sx={{
          minWidth: 500,
        }}
        ListboxProps={{
          style: {
            maxHeight: '70vh',
          },
        }}
        filterOptions={addressBookItemsFilter}
        loading={items === null}
        noOptionsText="Address book is empty"
        onChange={handleAddressSelected}
        onClose={handleClose}
        label="Search terms"
        getOptionKey={option => option.address + ' ||| ' + option.label}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: AddressLabelComment) => (
          <AddressOption {...{ props }} {...{ option }} />
        )}
      />
    </>
  );

  return (
    <>
      {!actionChooserVisible && addressChooser}
      {selectedItem && actionChooserVisible && (
        <ActionsChooser selectedItem={selectedItem} onClose={handleActionsClose} />
      )}
    </>
  );
}
