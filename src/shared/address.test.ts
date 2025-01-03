import { getCanonicalAddress } from './address';

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
});
