import { ReactNode } from 'react';
import { Typography } from '@mui/material';

export default function SettingsPageHeader({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}): ReactNode {
  if (title && children) {
    throw new Error("SettingsPageHeader can't have both title and children");
  }
  return (
    <Typography variant="h4" component="h2" sx={{ pb: 2 }}>
      {title}
      {children}
    </Typography>
  );
}
