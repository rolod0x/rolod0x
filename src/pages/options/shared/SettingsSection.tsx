import { ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';

export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Paper variant="outlined" sx={{ p: 1, mb: 2, maxWidth: 1000 }}>
      <Typography
        variant="h5"
        component="h3"
        color="primary.main"
        sx={{ fontWeight: 'bold', pb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
