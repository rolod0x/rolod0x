import { findAddress, getCanonicalAddress } from './address';

describe('getCanonicalAddress', () => {
  it('should return canonical form of valid checksummed address', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    expect(getCanonicalAddress(address)).toBe(address);
  });

  it('should return canonical form of lowercase address', () => {
    const address = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
    const expected = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    expect(getCanonicalAddress(address)).toBe(expected);
  });

  it('should return canonical form of uppercase address', () => {
    const address = '0x742D35CC6634C0532925A3B844BC454E4438F44E';
    const expected = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    expect(getCanonicalAddress(address)).toBe(expected);
  });

  it('should return null for invalid address (wrong length)', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44';
    expect(getCanonicalAddress(address)).toBeNull();
  });

  it('should return null for invalid address (invalid characters)', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44g';
    expect(getCanonicalAddress(address)).toBeNull();
  });

  it('should return null for invalid address (no 0x prefix)', () => {
    const address = '742d35Cc6634C0532925a3b844Bc454e4438f44e';
    expect(getCanonicalAddress(address)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(getCanonicalAddress('')).toBeNull();
  });

  it('should return null for non-string input', () => {
    // @ts-expect-error Testing invalid input type
    expect(getCanonicalAddress(123)).toBeNull();
  });

  it('should return a valid Solana address unchanged', () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    expect(getCanonicalAddress(address)).toBe(address);
  });

  it('should return the shortest valid Solana address unchanged', () => {
    const address = '11111111111111111111111111111111';
    expect(getCanonicalAddress(address)).toBe(address);
  });

  it('should return null for invalid Solana address (invalid characters)', () => {
    expect(getCanonicalAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSK0')).toBeNull();
  });

  it('should return null for invalid Solana address (not 32 bytes)', () => {
    expect(getCanonicalAddress('d4b5e1f9a8c7b6e3d2f1a9b8c7d6e5f4a3b2c1d9')).toBeNull();
  });
});

describe('findAddress', () => {
  const EVM = '0xe3D82337F79306712477b642EF59B75dD62eF109';
  const SOLANA = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
  // Looks like a Solana address, but doesn't decode to 32 bytes
  const NOT_SOLANA = 'd4b5e1f9a8c7b6e3d2f1a9b8c7d6e5f4a3b2c1d9';

  it('finds an EVM address', () => {
    expect(findAddress(`<a href="/address/${EVM}">foo</a>`)).toBe(EVM);
  });

  it('finds a Solana address', () => {
    expect(findAddress(`<a href="/account/${SOLANA}">foo</a>`)).toBe(SOLANA);
  });

  it('prefers an EVM address to a preceding Solana address', () => {
    expect(findAddress(`${SOLANA} ${EVM}`)).toBe(EVM);
  });

  it('finds an EVM address preceded by a string which looks like a Solana address', () => {
    expect(findAddress(`<span data-commit="${NOT_SOLANA}">${EVM}</span>`)).toBe(EVM);
  });

  it('finds a Solana address preceded by a string which looks like a Solana address', () => {
    expect(findAddress(`<span data-commit="${NOT_SOLANA}">${SOLANA}</span>`)).toBe(SOLANA);
  });

  it('returns null if only strings which look like Solana addresses are found', () => {
    expect(findAddress(`<span data-commit="${NOT_SOLANA}">foo</span>`)).toBeNull();
  });
});
