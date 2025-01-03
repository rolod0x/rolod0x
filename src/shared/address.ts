import { getAddress } from 'ethers';

export function getCanonicalAddress(address: string): string | null {
  try {
    if (typeof address !== 'string' || !address.startsWith('0x')) {
      return null;
    }
    return getAddress(address);
  } catch (err: unknown) {
    return null;
  }
}
