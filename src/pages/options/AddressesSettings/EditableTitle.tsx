import { useState, useCallback, KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { TextField, ClickAwayListener, Box, styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    cursor: 'text',
  },
  '& .MuiInputBase-input': {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    lineHeight: theme.typography.h4.lineHeight,
    fontFamily: theme.typography.h4.fontFamily,
    padding: '4px 8px',
  },
  '& .MuiInputBase-input.Mui-readOnly': {
    cursor: 'text',
  },
}));

export default function EditableTitle({ title, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure the local state is updated when the title prop changes
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement | HTMLInputElement>) => {
    event.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleIconClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
    // Focus the input on next tick after the readOnly prop is removed
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleClickAway = useCallback(() => {
    if (!isEditing) return;
    setIsEditing(false);
    if (editedTitle !== title && editedTitle.length > 0) {
      onTitleChange(editedTitle);
    } else {
      setEditedTitle(title); // discard changes
    }
  }, [isEditing, editedTitle, title, onTitleChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!isEditing) return;
      if (event.key === 'Enter') {
        if (editedTitle !== title && editedTitle.length > 0) {
          setIsEditing(false);
          onTitleChange(editedTitle);
        }
      } else if (event.key === 'Escape') {
        setIsEditing(false);
        setEditedTitle(title); // discard changes
      }
    },
    [editedTitle, title, onTitleChange, isEditing],
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: 'fit-content',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}>
        <StyledTextField
          variant="standard"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          inputRef={inputRef}
          InputProps={{
            disableUnderline: true,
            readOnly: !isEditing,
          }}
        />
        {!isEditing && (
          <EditIcon
            fontSize="small"
            sx={{ opacity: 0.5, ml: 1 }}
            titleAccess="Click to edit"
            onClick={handleIconClick}
          />
        )}
      </Box>
    </ClickAwayListener>
  );
}
