import { useTheme } from '@mui/material/styles';

export default function Rolod0xText() {
  const theme = useTheme();

  return (
    <span>
      rolod<span style={{ color: theme.palette.primary.main }}>0x</span>
    </span>
  );
}
