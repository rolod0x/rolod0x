// EVM regexps
export const RE_ADDRESS = /0x[0-9a-f]{40}\b/i;
export const RE_BYTES32 = /\b(0x)?[0-9a-f]{64}\b/i;
export const RE_ADDRESS_OR_BYTES32 = new RegExp(`(${RE_ADDRESS.source}|${RE_BYTES32.source})`, 'i');

// Solana regexps
export const RE_SOLANA_ADDRESS = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

// Combined regexps
export const RE_ADDRESS_FORMATS = new RegExp(
  `(${RE_ADDRESS.source}|${RE_SOLANA_ADDRESS.source})`,
  'i',
);
export const RE_ADDRESSES_OR_BYTES32 = new RegExp(
  `(${RE_ADDRESS.source}|${RE_BYTES32.source}|${RE_SOLANA_ADDRESS.source})`,
  'i',
);
