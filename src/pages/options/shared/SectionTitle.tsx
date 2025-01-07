import { Typography } from '@mui/material';

interface SectionTitleProps {
  title: string;
  first?: boolean;
}

const SectionTitle = ({ title, first }: SectionTitleProps) => (
  <Typography variant="h4" gutterBottom sx={{ mt: first ? 0 : 4 }}>
    {title}
  </Typography>
);

export default SectionTitle;
