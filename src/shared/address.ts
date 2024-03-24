import { getAddress } from 'ethers';

export function getCanonicalAddress(address: string): string | null {
  try {
    return getAddress(address);
  } catch (err: unknown) {
    return null;
  }
}
