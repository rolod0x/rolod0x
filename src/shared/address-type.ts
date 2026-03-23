import { RE_EVM_ADDRESS, RE_EVM_BYTES32, RE_SOLANA_ADDRESS } from './regexps';
import { AddressType } from './types';

export function isAddressTypeCaseSensitive(addressType: AddressType): boolean {
  switch (addressType) {
    case AddressType.EVM:
      return false;
    case AddressType.Solana:
      return true;
  }
}

export function getAddressType(address: string): AddressType | null {
  if (RE_EVM_ADDRESS.test(address) || RE_EVM_BYTES32.test(address)) {
    return AddressType.EVM;
  }
  if (RE_SOLANA_ADDRESS.test(address)) {
    return AddressType.Solana;
  }
  return null;
}

export function getAddressTypeOrThrow(address: string): AddressType {
  const addressType = getAddressType(address);
  if (!addressType) {
    throw new Error(`BUG: could not determine address type for '${address}'`);
  }
  return addressType;
}
