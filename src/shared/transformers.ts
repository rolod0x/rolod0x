import { getCanonicalAddress } from './address';

// Spot addresses embedded into EVM 256 bit words.  This is typically
// seen in event data.
export function zeroPaddedAddress(address: string): string[] {
  if (!getCanonicalAddress(address)) {
    return [];
  }
  // Addresses are 20 bytes, so to pad to 32 bytes we need an extra
  // 12 bytes of zero padding (24 nibbles).
  const padded = '00'.repeat(12) + address.slice(2);
  const addrs = [padded, '0x' + padded];
  return addrs;
}

export const TRANSFORMER_FUNCTIONS = [zeroPaddedAddress];
