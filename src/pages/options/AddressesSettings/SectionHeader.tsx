import { useCallback } from 'react';
import { Box, AccordionSummary, styled } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import EditableTitle from './EditableTitle';
import DeleteSection from './DeleteSection';

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
  updateTitle: ((title: string) => void) | undefined;
  deleteSection: () => Promise<void>;
}

export default function SectionHeader({
  sectionId,
  title,
  updateTitle,
  deleteSection,
}: SectionHeaderProps) {
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (updateTitle) {
        updateTitle(newTitle);
      }
    },
    [updateTitle],
  );

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
          <EditableTitle title={title} onTitleChange={handleTitleChange} />
        </Box>
        <DeleteSection deleteSection={deleteSection} />
      </Box>
    </StyledAccordionSummary>
  );
}
