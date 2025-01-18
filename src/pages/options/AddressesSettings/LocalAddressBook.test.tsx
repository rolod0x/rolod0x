import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditorView } from '@codemirror/view';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import {
  mockGetAll,
  mockSet,
  mockGetSection,
  resetOptionsMocks,
} from '@root/test-utils/mocks/options-storage';
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

// Helper function to get the CodeMirror view instance
const getCodeMirrorView = async (): Promise<EditorView> => {
  const editor = await screen.findByTestId('codeMirror-editor');
  const view = EditorView.findFromDOM(editor as HTMLElement);
  if (!view) {
    throw new Error('CodeMirror view not found');
  }
  return view;
};

// Helper function to simulate text input in CodeMirror
const setCodeMirrorValue = async (value: string) => {
  await act(async () => {
    const view = await getCodeMirrorView();
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  });
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
