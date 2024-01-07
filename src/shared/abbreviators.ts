const ABBREVIATION_LENGTHS = [
  // On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis Safe),
  // we see addresses abbreviated in the form 0x12345678...1234
  [8, 4],

  // On app.safe.global, we see signer addresses in confirmations
  // abbreviated in the form 0x1234...1234
  [4, 4],

  // On etherscan, we see addresses abbreviated in the form 0x123456...12345678
  [6, 8],

  // On Coinbase, we see addresses abbreviated in the form 0x123...12345
  [3, 5],
];

export function abbreviatedAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS.map(
    ([left, right]: [number, number]) => address.slice(0, left + 2) + '...' + address.slice(-right),
  );
}

// Spot addresses embedded into EVM 256 bit words.  This is typically
// seen in event data.
export function zeroPaddedAddress(address: string): string[] {
  // Addresses are 20 bytes, so to pad to 32 bytes we need an extra
  // 12 bytes of zero padding (24 nibbles).
  const padded = '00'.repeat(12) + address.slice(2);
  return [padded, '0x' + padded];
}

export const ABBREVIATION_FUNCTIONS = [abbreviatedAddresses, zeroPaddedAddress];
