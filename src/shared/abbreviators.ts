const ABBREVIATION_LENGTHS = [
  // On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis
  // Safe), addresses are abbreviated in the form 0x12345678...1234
  [8, 4],

  // On Tenderly, some addresses are abbreviated in
  // 0x1234567890...1234 form, e.g. on the Contracts tab of a
  // "Simulated Transaction" page when one of the contracts is a proxy,
  // the implementation address is shown in this form.
  [10, 4],

  // On Tenderly, other addresses are abbreviated in 0x123456...123456
  // form, e.g. in the "Tokens transferred" tab of the "Simulated
  // Transaction" page.
  [6, 6],

  // On app.safe.global, signer addresses in confirmations are
  // abbreviated in the form 0x1234...1234
  [4, 4],

  // On etherscan and clones, addresses are _mostly_ abbreviated in
  // the form 0x123456...12345678
  [6, 8],

  // However, on the Holders tab of etherscan and clones, addresses
  // are abbreviated in the form 0x12345678...123456789.  Yay consistency!
  [8, 9],

  // On Coinbase and app.ens.domains, addresses are abbreviated in the
  // form 0x123...12345
  [3, 5],

  // On *.blockscout.com, some addresses are abbreviated in the form
  // 0x12...1234
  [2, 4],

  // On oklink.com, addresses are abbreviated to 0x1234...123456789a
  [4, 10],

  // On metasleuth.io, addresses within the transaction graph are split
  // into two vertically stacked <text> elements within the <svg>: the
  // top one is 30+0, and the bottom is 0+10.  We'd need some custom
  // code to replace this elegantly, but for now arguably replacing just
  // the top one is better than nothing, even though it's ugly.
  [30, 0],
];

export function abbreviatedAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS.map(
    ([left, right]: [number, number]) =>
      address.slice(0, left + 2) + (right === 0 ? '' : '...' + address.slice(-right)),
  );
}

export function krakenAbbreviation(address: string): string {
  const trimmed = address.replace(/^0x/, '');
  return `0x${trimmed.slice(0, 2)} ${trimmed.slice(2, 6)} ... ${trimmed.slice(-8, -4)} ${trimmed.slice(-4)}`;
}

export const ABBREVIATION_FUNCTIONS = [
  abbreviatedAddresses,
  (addr: string) => [krakenAbbreviation(addr)],
];

export function isAbbreviation(abbreviation: string, fullAddress: string): boolean {
  // First try matching Kraken-style format with spaces
  const krakenMatch = abbreviation.match(
    /^(0x[0-9a-f]{2})\s+([0-9a-f]{4})\s+\.\.\.\s+([0-9a-f]{4})\s+([0-9a-f]{4})$/i,
  );
  if (krakenMatch) {
    const [, prefix, middle, end1, end2] = krakenMatch;
    const fullWithoutPrefix = fullAddress.replace(/^0x/, '');
    return (
      fullAddress.startsWith(prefix) &&
      fullWithoutPrefix.startsWith(middle, 2) &&
      fullWithoutPrefix.endsWith(end1 + end2)
    );
  }

  // Then try standard format
  const standardMatch = abbreviation.match(/^(0x[0-9a-f]+)(?:\.\.\.([0-9a-f]+))?$/i);
  if (!standardMatch) return false;
  const [, start, end] = standardMatch;
  // We consider abbreviations valid only if the ERC-55 checksum
  // capitalization is preserved, OR if it was never there in
  // the first place.
  return fullAddress.startsWith(start) && fullAddress.endsWith(end || '');
}
