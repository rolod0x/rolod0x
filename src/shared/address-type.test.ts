import { AddressType } from './types';
import { getAddressType, getAddressTypeOrThrow, isAddressTypeCaseSensitive } from './address-type';

describe('isAddressTypeCaseSensitive', () => {
  it('returns false for EVM', () => {
    expect(isAddressTypeCaseSensitive(AddressType.EVM)).toBe(false);
  });

  it('returns true for Solana', () => {
    expect(isAddressTypeCaseSensitive(AddressType.Solana)).toBe(true);
  });
});

describe('getAddressType', () => {
  it('returns EVM for an EVM address', () => {
    expect(getAddressType('0xe3D82337F79306712477b642EF59B75dD62eF109')).toBe(AddressType.EVM);
  });

  it('returns Solana for a Solana address', () => {
    expect(getAddressType('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK')).toBe(AddressType.Solana);
  });

  it('returns null for anything else', () => {
    expect(getAddressType('not an address')).toBe(null);
  });
});

describe('getAddressTypeOrThrow', () => {
  it('returns the address type', () => {
    expect(getAddressTypeOrThrow('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK')).toBe(
      AddressType.Solana,
    );
  });

  it('throws for anything else', () => {
    expect(() => getAddressTypeOrThrow('not an address')).toThrow(
      "BUG: could not determine address type for 'not an address'",
    );
  });
});
