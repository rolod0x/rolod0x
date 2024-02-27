const ABBREVIATION_LENGTHS = [
  // On many sites (e.g. Tenderly, defender.openzeppelin.com, Gnosis
  // Safe), addresses are abbreviated in the form 0x12345678...1234
  [8, 4],

  // On app.safe.global, signer addresses in confirmations are
  // abbreviated in the form 0x1234...1234
  [4, 4],

  // On etherscan, addresses are abbreviated in the form
  // 0x123456...12345678
  [6, 8],

  // On Coinbase and app.ens.domains, addresses are abbreviated in the
  // form 0x123...12345
  [3, 5],
];

export function abbreviatedAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS.map(
    ([left, right]: [number, number]) => address.slice(0, left + 2) + '...' + address.slice(-right),
  );
}

export const ABBREVIATION_FUNCTIONS = [abbreviatedAddresses];
