const ABBREVIATION_LENGTHS = [
  // On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis
  // Safe), addresses are abbreviated in the form 0x12345678...1234
  [8, 4],

  // On Tenderly, some addresses are abbreviated in
  // 0x1234567890...1234 form, e.g. on the Contracts tab of a
  // Simulated Transaction page when one of the contracts is a proxy,
  // the implementation address is shown in this form.
  [10, 4],

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

  // On onceupon.xyz, addresses are abbreviated to 0x123...456
  [3, 3],
];

export function abbreviatedAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS.map(
    ([left, right]: [number, number]) => address.slice(0, left + 2) + '...' + address.slice(-right),
  );
}

export const ABBREVIATION_FUNCTIONS = [abbreviatedAddresses];

export function isAbbreviation(abbreviation: string, fullAddress: string): boolean {
  const m = abbreviation.match(/^(0x[0-9a-f]+)\.\.\.([0-9a-f]+)$/i);
  if (!m) return false;
  const [_match, start, end] = m;

  // We consider abbreviations valid only if the ERC-55 checksum
  // capitalization is preserved, OR if it was never there in
  // the first place.
  return fullAddress.startsWith(start) && fullAddress.endsWith(end);
}
