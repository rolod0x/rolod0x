import { useTheme } from '@mui/material/styles';

interface Props {
  bold?: boolean;
}

export default function Rolod0xText({ bold }: Props) {
  const theme = useTheme();

  return (
    <span style={bold && { fontWeight: 'bold' }}>
      rolod<span style={{ color: theme.palette.primary.main }}>0x</span>
    </span>
  );
}
