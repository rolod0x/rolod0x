import { MouseEvent } from 'react';
import { Box, Button, AccordionSummary, styled } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Delete as DeleteIcon } from '@mui/icons-material';

import EditableTitle from './EditableTitle';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper': {
    marginRight: theme.spacing(1),
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'transparent',
  },
}));

interface SectionHeaderProps {
  sectionId: string;
  title: string;
  onTitleChange: (newTitle: string) => void;
  onDelete: (e: MouseEvent) => void;
}

export default function SectionHeader({
  sectionId,
  title,
  onTitleChange,
  onDelete,
}: SectionHeaderProps) {
  return (
    <StyledAccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`panel-${sectionId}-content`}
      id={`panel-${sectionId}-header`}
      title="Click to expand/collapse">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EditableTitle title={title} onTitleChange={onTitleChange} />
        </Box>
        <Button
          className="section-delete-button"
          variant="contained"
          onClick={onDelete}
          startIcon={<DeleteIcon />}
          size="small"
          color="warning"
          sx={{ mr: 1 }}>
          Delete section
        </Button>
      </Box>
    </StyledAccordionSummary>
  );
}
