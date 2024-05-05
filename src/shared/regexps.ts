export const RE_ADDRESS = /0x[0-9a-f]{40}\b/i;
export const RE_BYTES32 = /\b(0x)?[0-9a-f]{64}\b/i;
export const RE_ADDRESS_OR_BYTES32 = new RegExp(`(${RE_ADDRESS.source}|${RE_BYTES32.source})`, 'i');
