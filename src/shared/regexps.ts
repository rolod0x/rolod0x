// EVM regexps
export const RE_EVM_ADDRESS = /0x[0-9a-fA-F]{40}\b/;
export const RE_EVM_BYTES32 = /\b(0x)?[0-9a-fA-F]{64}\b/;
export const RE_EVM_ADDRESS_OR_BYTES32 = new RegExp(
  `(${RE_EVM_ADDRESS.source}|${RE_EVM_BYTES32.source})`,
);

// Solana regexps
export const RE_SOLANA_ADDRESS = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;

// Combined regexps
export const RE_ADDRESS_FORMATS = new RegExp(
  `(${RE_EVM_ADDRESS.source}|${RE_SOLANA_ADDRESS.source})`,
);
export const RE_ADDRESSES_OR_BYTES32 = new RegExp(
  `(${RE_EVM_ADDRESS.source}|${RE_EVM_BYTES32.source}|${RE_SOLANA_ADDRESS.source})`,
);
