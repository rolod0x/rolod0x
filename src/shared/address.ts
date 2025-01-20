import { getAddress } from 'ethers';
import { isAddress as isSolanaAddress } from '@solana/addresses';

import { RE_EVM_ADDRESS, RE_SOLANA_ADDRESS } from './regexps';

const RE_SOLANA_ADDRESSES = new RegExp(RE_SOLANA_ADDRESS.source, 'g');

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

// Find an address in text such as HTML or a URL.  EVM addresses take
// precedence over Solana addresses.  Since text often contains strings
// which merely look like Solana addresses (e.g. hashes), those which
// aren't valid Solana addresses are skipped.
export function findAddress(text: string): string | null {
  const evmMatch = text.match(RE_EVM_ADDRESS);
  if (evmMatch) {
    return evmMatch[0];
  }

  for (const [candidate] of text.matchAll(RE_SOLANA_ADDRESSES)) {
    if (isSolanaAddress(candidate)) {
      return candidate;
    }
  }
  return null;
}
