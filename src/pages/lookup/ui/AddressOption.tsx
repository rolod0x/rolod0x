/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import styled from '@emotion/styled';
// import { css } from '@emotion/react';

import { AddressLabelComment } from '@src/shared/types';

interface Props {
  props: HTMLAttributes<HTMLLIElement>;
  option: AddressLabelComment;
}

export default function AddressOption({ props, option }: Props) {
  // Very frustratingly, neither of these work when used directly in <Stack>:
  //
  //      justifyContent="space-between"
  //      sx={{ justifyContent: 'space-between' }}
  //
  // because there is a built-in style on .MuiAutocomplete-option
  // which sets justify-content: flex-start.
  //
  // So we need the &.MuiAutocomplete-option trick below to get a higher
  // specificity.  This would also work without the & but it seems uglier:
  //
  //   justify-content: space-between !important;
  //
  // const stackClass = css`
  //   &.MuiAutocomplete-option {
  //     justify-content: space-between;
  //   }
  // `;

  // This alternative approach using styled() causes a nightmare with Typescript
  // compiler errors; see https://github.com/mui/material-ui/issues/16846
  //
  // const SpacedStack = styled(Stack)<StackProps<'li'> & { component: React.ElementType }>(
  //   `
  //    &.MuiAutocomplete-option {
  //      justify-content: space-between;
  //    }
  //   `,
  // );

  return (
    <Stack
      direction="row"
      // css={stackClass}
      sx={{ '&.MuiAutocomplete-option': { justifyContent: 'space-between' } }}
      spacing={2}
      component="li"
      {...props}>
      <Typography>{option.label}</Typography>{' '}
      <Typography component="code" color="secondary.dark">
        {option.address}
      </Typography>
    </Stack>
  );
}
