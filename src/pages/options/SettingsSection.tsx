import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Paper elevation={2} variant="outlined" sx={{ p: 1, mb: 2, maxWidth: 1000 }}>
      <Typography variant="h5" component="h3" sx={{ pb: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
