import { useCallback } from 'react';
import { AccordionSummary, styled, Stack } from '@mui/material';
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
        <EditableTitle title={title} onTitleChange={handleTitleChange} />
        <DeleteSection deleteSection={deleteSection} />
      </Stack>
    </StyledAccordionSummary>
  );
}
