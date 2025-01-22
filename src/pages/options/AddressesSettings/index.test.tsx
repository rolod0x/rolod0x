import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { mockGetAll, mockSet, resetOptionsMocks } from '@test-utils/mocks/options-storage';
import { setCodeMirrorValue } from '@test-utils/codemirror';
import Rolod0xThemeProvider from '@src/components/Rolod0xThemeProvider';
import { PageTitleProvider } from '@src/shared/contexts/PageTitleContext';
import { DEFAULT_OPTIONS_DESERIALIZED } from '@src/shared/options-storage';

import AddressesSettings from './index';

import type { Rolod0xAddressBookSection } from '@src/shared/options-storage';

// Mock uuid to return fixed values
vi.mock('uuid', () => ({
  v4: () => 'new-section-uuid',
}));

const defaultSection: Rolod0xAddressBookSection = {
  id: 'default-section-uuid',
  title: 'Personal address book',
  format: 'rolod0x',
  source: 'text',
  labels: '',
  url: null,
  expanded: true,
};

const mockDefaultOptions = {
  ...DEFAULT_OPTIONS_DESERIALIZED,
  sections: JSON.stringify([defaultSection]),
};

function AddressesSettingsWrapper() {
  return (
    <PageTitleProvider>
      <AddressesSettings />
    </PageTitleProvider>
  );
}

const renderAddressesSettings = async () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <AddressesSettingsWrapper />,
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

  expect(container).toBeInTheDocument();
  return container;
};

describe('AddressesSettings', () => {
  beforeEach(() => {
    resetOptionsMocks();
    vi.clearAllMocks();
    mockGetAll.mockResolvedValue(mockDefaultOptions);
  });

  it('should render the AddressesSettings component with initial sections', async () => {
    await renderAddressesSettings();

    // Check for main UI elements
    expect(screen.getByRole('alert')).toHaveTextContent(
      'After changing entries in the address book, you may have to reload pages for the changes to take effect.',
    );
    expect(screen.getByRole('button', { name: 'Add New Section' })).toBeInTheDocument();
  });

  it('should add a new section when clicking Add New Section button', async () => {
    await renderAddressesSettings();
    const user = userEvent.setup();

    const addButton = screen.getByRole('button', { name: 'Add New Section' });
    await user.click(addButton);

    const existingSections = [defaultSection];
    const newSection: Rolod0xAddressBookSection = {
      id: 'new-section-uuid',
      title: 'New section',
      format: 'rolod0x',
      source: 'text',
      labels: '',
      url: '',
      expanded: true,
    };
    const updatedSections = [...existingSections, newSection];

    await waitFor(() => {
      expect(mockSet).toHaveBeenCalledWith({
        sections: JSON.stringify(updatedSections),
      });
    });
  });

  it('should show tour for first-time users', async () => {
    mockGetAll.mockResolvedValue({
      ...mockDefaultOptions,
      hasSeenTour: false,
    });

    await renderAddressesSettings();

    // The Tour component should be rendered with runTour=true
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent('Welcome to rolod0x!');
    expect(dialog).toHaveTextContent("Let's give you a lightning quick tour");
  });

  it('should not show tour for returning users', async () => {
    mockGetAll.mockResolvedValue({
      ...mockDefaultOptions,
      hasSeenTour: true,
    });

    await renderAddressesSettings();

    // The Tour component should not be visible
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should handle options reset event', async () => {
    await renderAddressesSettings();

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    // Simulate options reset event
    await act(async () => {
      window.dispatchEvent(new Event('options-reset'));
    });

    expect(confirmSpy).not.toHaveBeenCalled(); // No unsaved changes initially
    expect(mockGetAll).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('should prevent tab closing when there are unsaved changes', async () => {
    await renderAddressesSettings();

    // Get the editor and simulate entering text
    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    // Create a beforeunload event
    const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    event.preventDefault = vi.fn();

    // Simulate tab/window closing
    window.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prompt for unsaved changes when resetting options', async () => {
    await renderAddressesSettings();

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    // Get the editor and simulate entering text
    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    // Simulate options reset event
    await act(async () => {
      window.dispatchEvent(new Event('options-reset'));
    });

    expect(confirmSpy).toHaveBeenCalledWith(
      'You have unsaved changes. Resetting all options will lose these changes. Are you sure you want to proceed?',
    );
    expect(mockGetAll).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('should handle navigation blocking with unsaved changes', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <AddressesSettingsWrapper />,
      },
      {
        path: '/other',
        element: <div>Other page</div>,
      },
    ]);

    await act(async () => {
      render(
        <Rolod0xThemeProvider initialTheme="light">
          <RouterProvider router={router} />
        </Rolod0xThemeProvider>,
      );
    });

    // Get the editor and simulate entering text
    const testInput = '0x1234567890123456789012345678901234567890 Test Address';
    await setCodeMirrorValue(testInput);

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => false);

    // Attempt to navigate away
    await act(async () => {
      router.navigate('/other');
    });

    expect(confirmSpy).toHaveBeenCalledWith(
      'You have unsaved changes in one or more sections. Are you sure you want to leave?',
    );
    expect(router.state.location.pathname).toBe('/'); // Should stay on current page

    confirmSpy.mockRestore();
  });

  it('should allow tab closing when there are no unsaved changes', async () => {
    await renderAddressesSettings();

    // Create a beforeunload event
    const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    event.preventDefault = vi.fn();

    // Simulate tab/window closing
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
