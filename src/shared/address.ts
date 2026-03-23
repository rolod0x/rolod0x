import { getAddress } from 'ethers';
import { isAddress as isSolanaAddress } from '@solana/addresses';

export function getCanonicalAddress(address: string): string | null {
  try {
    if (typeof address !== 'string') {
      return null;
    }
    if (address.startsWith('0x')) {
      return getAddress(address);
    }
    if (isSolanaAddress(address)) {
      return address;
    }
    return null;
  } catch (err: unknown) {
    return null;
  }
}
