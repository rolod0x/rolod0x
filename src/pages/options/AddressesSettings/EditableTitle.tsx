import { useState, useCallback, KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { TextField, ClickAwayListener, styled, Stack, Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

const inputFieldStyle = (theme: Theme) => ({
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.h4.fontWeight,
  lineHeight: theme.typography.h4.lineHeight,
  fontFamily: theme.typography.h4.fontFamily,
  padding: '4px 0px 4px 4px',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    cursor: 'text',
  },
  '& .MuiInputBase-input.Mui-readOnly': {
    cursor: 'text',
  },
  '& .MuiInputBase-input': inputFieldStyle(theme),
}));

// Trick for measuring the width of the input text field copied from
// https://stackoverflow.com/a/38867270/179332 to use a hidden version
// of the text field that mirrors the content from the visible
// TextField, and then use that to measure the width and dynamically
// resize the visible one.  It has to be a span because <input>
// elements have a fixed width which depends on their size attribute.
const HiddenTextField = styled('span')(({ theme }) => ({
  ...inputFieldStyle(theme),
  color: 'red',
  overflow: 'hidden',
  position: 'absolute', // prevent from displacing the visible text field
  whiteSpace: 'pre', // preserve whitespace
  width: 'auto', // override 100% from MUI
  height: 0, // make it invisible whilst keeping a measurable non-zero width
  // for debugging:
  // border: '1px solid red',
}));

export default function EditableTitle({ title, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLSpanElement>(null);

  const updateEditedTitle = useCallback((newValue: string) => {
    setEditedTitle(newValue);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.textContent = newValue;
      inputRef.current?.style.setProperty('width', `${hiddenInputRef.current?.offsetWidth}px`);
    }
  }, []);

  // Ensure the local state is updated when the title prop changes
  useEffect(() => {
    updateEditedTitle(title);
  }, [title, updateEditedTitle]);

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

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      updateEditedTitle(newValue);
    },
    [updateEditedTitle],
  );

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
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          title: 'Click to edit the section title',
        }}>
        <HiddenTextField className="shadowTextField" ref={hiddenInputRef}>
          {editedTitle}
        </HiddenTextField>
        <StyledTextField
          fullWidth
          variant="standard"
          value={editedTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          inputRef={inputRef}
          InputProps={{
            disableUnderline: true,
            readOnly: !isEditing,
          }}
        />
        <EditIcon
          fontSize="small"
          sx={{ opacity: isEditing ? 0 : 0.5, ml: 1 }}
          onClick={handleIconClick}
        />
      </Stack>
    </ClickAwayListener>
  );
}
