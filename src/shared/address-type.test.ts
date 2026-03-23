import { AddressType } from './types';
import { isAddressTypeCaseSensitive } from './address-type';

describe('isAddressTypeCaseSensitive', () => {
  it('returns false for EVM', () => {
    expect(isAddressTypeCaseSensitive(AddressType.EVM)).toBe(false);
  });

  it('returns true for Solana', () => {
    expect(isAddressTypeCaseSensitive(AddressType.Solana)).toBe(true);
  });
});
