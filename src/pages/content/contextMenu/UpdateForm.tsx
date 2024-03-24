import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { IframeContext } from '@src/components/IframeModal';
import { getCanonicalAddress } from '@src/shared/address';
import { addNewEntry, isNewAddress } from '@src/shared/address-book';
import { delayedFocusInput } from '@src/shared/focus';

export default function UpdateForm() {
  const { handleUpdate, handleClose } = useContext(IframeContext);
  const textFieldRef = useRef(null);
  const focusTextField = useCallback(() => delayedFocusInput(textFieldRef), [textFieldRef]);
  const searchParams = new URLSearchParams(window.location.search);
  const initialAddress = searchParams.get('address');

  const [address, setAddress] = useState(initialAddress);
  const [label, setLabel] = useState('');
  const [comment, setComment] = useState('');

  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    focusTextField();
  }, [focusTextField]);

  const validateAddress = useCallback(
    addr => {
      setAddressError(getCanonicalAddress(addr) ? '' : 'Invalid address');
    },
    [setAddressError],
  );

  const handleAddressChange = useCallback(
    event => {
      setAddress(event.target.value);
      validateAddress(event.target.value);
    },
    [setAddress, validateAddress],
  );

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      if (!getCanonicalAddress(address)) {
        console.log(`rolod0x: Invalid address ${address}`);
        return;
      }

      const isNew = await isNewAddress(address);
      if (isNew) {
        await addNewEntry(address, label, comment);
        handleUpdate();
        console.debug('rolod0x: Submitted new entry:', address, label, comment);
        handleClose();
      } else {
        setAddressError('Address already in address book');
      }
    },
    [handleUpdate, handleClose, address, label, comment],
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <Stack spacing={2}>
          <TextField
            id="address"
            label="Address"
            defaultValue={initialAddress}
            onChange={handleAddressChange}
            inputProps={{ spellcheck: 'false' }}
            error={!!addressError}
            helperText={addressError}
            required
            sx={{ maxWidth: '28rem' }}
          />
          <TextField
            id="label"
            label="Label"
            inputRef={textFieldRef}
            onChange={e => setLabel(e.target.value)}
            required
          />
          <TextField id="comment" label="Comment" onChange={e => setComment(e.target.value)} />
          <FormHelperText error={!!addressError}>
            {addressError ? 'Please enter a valid address.' : ''}
          </FormHelperText>
          <Button variant="contained" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </FormControl>
    </form>
  );
}
