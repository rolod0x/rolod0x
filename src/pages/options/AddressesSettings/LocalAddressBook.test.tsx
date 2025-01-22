import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditorView } from '@codemirror/view';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import {
  mockGetAll,
  mockSet,
  mockGetSection,
  resetOptionsMocks,
} from '@test-utils/mocks/options-storage';
import { getCodeMirrorView, setCodeMirrorValue } from '@test-utils/codemirror';
import Rolod0xThemeProvider from '@src/components/Rolod0xThemeProvider';
import { DEFAULT_OPTIONS_DESERIALIZED } from '@src/shared/options-storage';

import LocalAddressBook from './LocalAddressBook';

// Mock the uuid used for the default section
const DEFAULT_SECTION_ID = DEFAULT_OPTIONS_DESERIALIZED.sections[0].id;

function LocalAddressBookWrapper() {
  return (
    <LocalAddressBook sectionId={DEFAULT_SECTION_ID} _index={0} onUnsavedChanges={async () => {}} />
  );
}

const renderLocalAddressBook = async () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <LocalAddressBookWrapper />,
    },
  ]);

  let container: HTMLElement;
  await act(async () => {
    ({ container } = render(
      <Rolod0xThemeProvider initialTheme="light">
        <RouterProvider router={router} />
      </Rolod0xThemeProvider>,
    ));
  });

  // First ensure the component is rendered
  expect(container).toBeInTheDocument();

  // Wait for the component to be fully rendered and hydrated
  const editor = await screen.findByTestId('codeMirror-editor');
  expect(editor).toBeInTheDocument();

  // Wait for CodeMirror to initialize
  const view = EditorView.findFromDOM(editor as HTMLElement);
  expect(view).toBeTruthy();

  return container;
};

describe('LocalAddressBook', () => {
  beforeEach(async () => {
    resetOptionsMocks();
  });

  it('should render the LocalAddressBook component', async () => {
    const abook = await renderLocalAddressBook();
    expect(abook).toBeTruthy();

    // Wait for the text to be visible
    await waitFor(() => {
      expect(screen.getByDisplayValue('Personal address book')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Paste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard changes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should enable the Save button when there are changes', async () => {
    await renderLocalAddressBook();

    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    // Wait for the save button to be enabled after valid input
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should disable the Save button when there is an invalid address', async () => {
    await renderLocalAddressBook();

    const testInput = '0x12345678901234567890 Test Address'; // Invalid address (too short)
    await setCodeMirrorValue(testInput);

    // Wait for the save button to be disabled after invalid input
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
  });

  it('should disable the Save button after removing a new address', async () => {
    await renderLocalAddressBook();

    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    // Wait for the save button to be enabled after valid input
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    // Simulate removing the text we just entered
    await setCodeMirrorValue('');

    // Wait for the save button to be disabled after removing input
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
  });

  it('should save successfully after inserting a valid address', async () => {
    await renderLocalAddressBook();

    const testInput = '0xe3D82337F79306712477b642EF59B75dD62eF109 different address';
    await setCodeMirrorValue(testInput);

    // Wait for the save button to be enabled after valid input
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    // Click the save button
    await act(async () => {
      saveButton.click();
    });

    // Verify the save was successful
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(mockSet).toHaveBeenCalledWith({
        sections: JSON.stringify([
          {
            ...DEFAULT_OPTIONS_DESERIALIZED.sections[0],
            labels: testInput,
          },
        ]),
      });
    });

    // Verify the content is still there after save
    const view = await getCodeMirrorView();
    expect(view.state.doc.toString()).toBe(testInput);
  });

  it('should discard changes after clicking the Discard button', async () => {
    // Set up initial storage state
    const initialLabels = '0x1234567890123456789012345678901234567890 Initial Address';
    // We can't use labelsToSection here because it creates a new section with a new id,
    // and the only delta from the defaults we want in order to test discarding is the labels.
    // The section id needs to remain constant within the component under test.
    const initialSection = DEFAULT_OPTIONS_DESERIALIZED.sections[0];
    initialSection.labels = initialLabels;
    mockGetAll.mockResolvedValue({
      ...DEFAULT_OPTIONS_DESERIALIZED,
      sections: JSON.stringify([initialSection]),
    });
    mockGetSection.mockResolvedValue(initialSection);

    await renderLocalAddressBook();

    // Wait for initial content to be loaded
    await waitFor(async () => {
      const view = await getCodeMirrorView();
      expect(view.state.doc.toString()).toBe(initialLabels);
    });

    const testInput = '0xe3D82337F79306712477b642EF59B75dD62eF109 different address';
    await setCodeMirrorValue(testInput);

    // Wait for the editor content to be updated
    await waitFor(async () => {
      const view = await getCodeMirrorView();
      expect(view.state.doc.toString()).toBe(testInput);
    });

    const discardButton = screen.getByRole('button', { name: 'Discard changes' });
    await waitFor(async () => {
      expect(discardButton).not.toBeDisabled();
    });

    // Click the discard button
    await act(async () => {
      discardButton.click();
    });

    // Wait for the editor content to be reverted to initial state
    await waitFor(async () => {
      const view = await getCodeMirrorView();
      expect(view.state.doc.toString()).toBe(initialLabels);
      expect(discardButton).toBeDisabled();
      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();
    });
  });

  it('should save changes when pressing Ctrl+S or Cmd+S', async () => {
    await renderLocalAddressBook();

    const testInput = '0xe3D82337F79306712477b642EF59B75dD62eF109 different address';
    await setCodeMirrorValue(testInput);

    // Wait for the save button to be enabled after valid input
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    // Simulate Ctrl+S
    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 's',
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });

    // Verify the save was successful
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(mockSet).toHaveBeenCalledWith({
        sections: JSON.stringify([
          {
            ...DEFAULT_OPTIONS_DESERIALIZED.sections[0],
            labels: testInput,
          },
        ]),
      });
    });

    // Verify the content is still there after save
    const view = await getCodeMirrorView();
    expect(view.state.doc.toString()).toBe(testInput);
  });
});

describe('LocalAddressBook section deletion', () => {
  beforeEach(async () => {
    resetOptionsMocks();
  });

  it('should show delete confirmation dialog when delete button is clicked', async () => {
    await renderLocalAddressBook();

    // Click the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete section' });
    await act(async () => {
      deleteButton.click();
    });

    // Check if confirmation dialog is shown
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Section?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this section? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
  });

  it('should show additional warning when deleting section with unsaved changes', async () => {
    await renderLocalAddressBook();

    // Make some changes to trigger unsaved state
    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    // Click the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete section' });
    await act(async () => {
      deleteButton.click();
    });

    // Mock window.confirm to capture the warning message
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockReturnValue(true);

    // Click the confirm delete button
    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
    await act(async () => {
      confirmDeleteButton.click();
    });

    // Verify the warning about unsaved changes was shown
    expect(confirmSpy).toHaveBeenCalledWith(
      'This section has unsaved changes. Are you sure you want to delete it and lose these changes?',
    );
  });

  it('should cancel deletion when Cancel button is clicked', async () => {
    await renderLocalAddressBook();

    // Click the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete section' });
    await act(async () => {
      deleteButton.click();
    });

    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await act(async () => {
      cancelButton.click();
    });

    // Wait for the dialog to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Verify section still exists
    expect(screen.getByRole('button', { name: 'Delete section' })).toBeInTheDocument();
  });

  it('should delete section when confirmed', async () => {
    await renderLocalAddressBook();

    // Set up spy before any actions
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    // Click the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete section' });
    await act(async () => {
      deleteButton.click();
    });

    // Click the confirm delete button
    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
    await act(async () => {
      confirmDeleteButton.click();
    });

    // Wait for and verify delete event was dispatched
    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
    });
    const event = dispatchEventSpy.mock.calls[0][0] as Event;
    expect(event.type).toBe('section-deleted');

    // Clean up spy
    dispatchEventSpy.mockRestore();
  });
});
