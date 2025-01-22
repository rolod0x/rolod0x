import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { mockGetAll, mockSet, resetOptionsMocks } from '@root/test-utils/mocks/options-storage';
import Rolod0xThemeProvider from '@src/components/Rolod0xThemeProvider';
import { PageTitleProvider } from '@src/shared/contexts/PageTitleContext';
import { DEFAULT_OPTIONS_DESERIALIZED } from '@src/shared/options-storage';

import AddressesSettings from './index';

import type { Rolod0xAddressBookSection } from '@src/shared/options-storage';

// Mock uuid to return fixed values
vi.mock('uuid', () => ({
  v4: () => 'new-section-uuid',
}));

// Mock LocalAddressBook component
vi.mock('./LocalAddressBook', () => ({
  default: ({
    sectionId,
    onUnsavedChanges,
  }: {
    sectionId: string;
    onUnsavedChanges: (sectionId: string, hasChanges: boolean) => void;
  }) => {
    // Call onUnsavedChanges with false initially
    onUnsavedChanges(sectionId, false);
    return (
      <button
        data-testid="local-address-book"
        data-section-id={sectionId}
        onClick={() => onUnsavedChanges(sectionId, true)}
        onKeyDown={e => e.key === 'Enter' && onUnsavedChanges(sectionId, true)}>
        Mocked LocalAddressBook
      </button>
    );
  },
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

  it('should prompt for unsaved changes when resetting options', async () => {
    await renderAddressesSettings();

    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    // Get the onUnsavedChanges prop from the mocked component
    const localAddressBook = screen.getByTestId('local-address-book');
    const user = userEvent.setup();

    // Simulate having unsaved changes by clicking the component
    await user.click(localAddressBook);

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

    // Get the onUnsavedChanges prop from the mocked component
    const localAddressBook = screen.getByTestId('local-address-book');
    const user = userEvent.setup();

    // Simulate having unsaved changes by clicking the component
    await user.click(localAddressBook);

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
});
