export const storage = {
  local: {
    get: vi.fn(),
    set: vi.fn(),
  },
};

export const runtime = {
  id: 'fake-id',
  sendMessage: vi.fn(),
};
