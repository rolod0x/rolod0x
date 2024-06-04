import { DEFAULT_OPTIONS_SERIALIZED } from '@src/shared/options-storage';

const freshSerializedOptions = () => {
  return { ...DEFAULT_OPTIONS_SERIALIZED };
};

// Create mock functions that can be used across tests
export const mockGetAll = vi.fn();
export const mockSet = vi.fn();
export const mockSetAll = vi.fn();

// Mock for webext-options-sync
vi.mock('webext-options-sync', () => {
  return {
    default: class MockOptionsSync {
      static migrations = {
        removeUnused: vi.fn(),
      };

      constructor() {
        // Do nothing
      }

      async getAll() {
        return mockGetAll();
      }

      async set(newOptions) {
        return mockSet(newOptions);
      }

      async setAll(newOptions) {
        return mockSetAll(newOptions);
      }
    },
  };
});

// Convenience function to reset all mocks between tests
export const resetOptionsMocks = () => {
  mockGetAll.mockClear();
  mockSet.mockClear();
  mockSetAll.mockClear();

  // Reset to default values
  mockGetAll.mockResolvedValue(freshSerializedOptions());
};

resetOptionsMocks();
