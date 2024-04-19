const ABBREVIATION_LENGTHS = [
  // On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis
  // Safe), addresses are abbreviated in the form 0x12345678...1234
  [8, 4],

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
];

export function abbreviatedAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS.map(
    ([left, right]: [number, number]) => address.slice(0, left + 2) + '...' + address.slice(-right),
  );
}

export const ABBREVIATION_FUNCTIONS = [abbreviatedAddresses];
