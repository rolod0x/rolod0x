import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

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
