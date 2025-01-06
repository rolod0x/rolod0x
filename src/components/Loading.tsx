import { Box, Stack, CircularProgress } from '@mui/material';

interface Props {
  text?: string;
}

export default function Loading(props: Props) {
  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
      <CircularProgress />
      <Box>{props.text || 'Loading sites ...'}</Box>
    </Stack>
  );
}
