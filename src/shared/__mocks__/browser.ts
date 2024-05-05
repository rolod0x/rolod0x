import { jest } from '@jest/globals';

export const storage = {
  local: {
    get: jest.fn(),
    set: jest.fn(),
  },
};

export const runtime = {
  id: 'fake-id',
  sendMessage: jest.fn(),
};
