import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';

import { delayedFocusInput } from '@src/shared/focus';

type FocusedAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'ref' | 'autoFocus' | 'multiple' | 'disableClearable' | 'freeSolo'
> & {
  label?: string;
  inputProps?: HTMLAttributes<HTMLInputElement>;
};

export default function FocusedAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  label = '',
  inputProps = {},
  ...props
}: FocusedAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const textFieldRef = useRef<HTMLInputElement>(null);
  const focusTextField = useCallback(() => delayedFocusInput(textFieldRef), [textFieldRef]);

  useEffect(() => {
    focusTextField();

    window.addEventListener('message', function (event) {
      if (event.data === 'focus-input') {
        focusTextField();
        const textField = textFieldRef.current;
        if (textField) {
          textField.select();
        }
      }
    });
  }, [focusTextField]);

  /* eslint-disable jsx-a11y/no-autofocus */
  return (
    <Autocomplete<T, false, false, false>
      {...(props as AutocompleteProps<T, false, false, false>)}
      autoFocus
      autoHighlight
      clearOnBlur={false}
      // This would break Escape closing the dropdown and then a second escape
      // closing the modal:
      // open={true}
      // However it _is_ useful for debugging.
      openOnFocus={true}
      clearOnEscape={false}
      selectOnFocus={false}
      multiple={false}
      disableClearable={false}
      freeSolo={false}
      renderInput={params => (
        <TextField
          {...params}
          inputRef={textFieldRef}
          label={label}
          inputProps={{ ...params.inputProps, ...inputProps }}
        />
      )}
    />
  );
}
