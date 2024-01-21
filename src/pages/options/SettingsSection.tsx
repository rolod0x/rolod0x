import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';

export default function SettingsSection({ children }: { children: ReactNode }): ReactNode {
  return (
    <Paper elevation={2} variant="outlined" sx={{ p: 1, mb: 2 }}>
      {children}
    </Paper>
  );
}
