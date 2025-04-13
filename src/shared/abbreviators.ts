import { AddressType } from './types';

const ABBREVIATION_LENGTHS_EVM = [
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

  // On Binance, addresses are sometimes abbreviated in
  // the form 0x1234...123456
  [4, 6],

  // On Binance, whitelist addresses are abbreviated in
  // the form 0x12345678...1234567890
  [8, 10],

  // On Kraken, addresses are sometimes abbreviated in
  // the form 0x123456...12345
  [6, 5],

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

const ABBREVIATION_LENGTHS_SOLANA = [
  // On solscan.io, addresses are abbreviated in the form
  // 1234567890...1234567890
  [10, 10],

  // On raydium.io, addresses in the token selection modal are abbreviated
  // in the form 123456...123456
  [6, 6],

  // On jup.ag, addresses in the token selection modal are abbreviated
  // in the form 12345...12345
  [5, 5],

  // On meteora.ag, addresses in the pool creation page are abbreviated
  // in the form 1234...1234
  [4, 4],
];

export function abbreviatedEVMAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS_EVM.map(
    ([left, right]: [number, number]) =>
      address.slice(0, left + 2) + (right === 0 ? '' : '...' + address.slice(-right)),
  );
}

export function krakenAbbreviation(address: string): string {
  const trimmed = address.replace(/^0x/, '');
  return `0x${trimmed.slice(0, 2)} ${trimmed.slice(2, 6)} ... ${trimmed.slice(-8, -4)} ${trimmed.slice(-4)}`;
}

export function abbreviatedSolanaAddresses(address: string): string[] {
  return ABBREVIATION_LENGTHS_SOLANA.map(
    ([left, right]: [number, number]) =>
      address.slice(0, left) + (right === 0 ? '' : '...' + address.slice(-right)),
  );
}

export type AbbreviationFunc = (address: string) => string[];

export const ABBREVIATION_FUNCTIONS: Record<AddressType, AbbreviationFunc[]> = {
  EVM: [abbreviatedEVMAddresses, (addr: string) => [krakenAbbreviation(addr)]],
  Solana: [abbreviatedSolanaAddresses],
};

const isKrakenAbbreviation = (abbreviation: string, fullAddress: string): boolean => {
  const krakenMatch = abbreviation.match(
    /^(0x[0-9a-f]{2})\s+([0-9a-f]{4})\s+\.\.\.\s+([0-9a-f]{4})\s+([0-9a-f]{4})$/i,
  );
  if (!krakenMatch) return false;
  const [, prefix, middle, end1, end2] = krakenMatch;
  const fullWithoutPrefix = fullAddress.replace(/^0x/, '');
  return (
    fullAddress.startsWith(prefix) &&
    fullWithoutPrefix.startsWith(middle, 2) &&
    fullWithoutPrefix.endsWith(end1 + end2)
  );
};

const isStandardEVMAbbreviation = (abbreviation: string, fullAddress: string): boolean => {
  const standardMatch = abbreviation.match(/^(0x[0-9a-f]+)(?:\.\.\.([0-9a-f]+))?$/i);
  if (!standardMatch) return false;
  const [, start, end] = standardMatch;
  // We consider abbreviations valid only if the ERC-55 checksum
  // capitalization is preserved, OR if it was never there in
  // the first place.
  return fullAddress.startsWith(start) && fullAddress.endsWith(end || '');
};

const isSolanaAbbreviation = (abbreviation: string, fullAddress: string): boolean => {
  const solanaMatch = abbreviation.match(
    /^([1-9A-HJ-NP-Za-km-z]+)(?:\.\.\.([1-9A-HJ-NP-Za-km-z]+))?$/i,
  );
  if (!solanaMatch) return false;
  const [, start, end] = solanaMatch;
  return fullAddress.startsWith(start) && fullAddress.endsWith(end || '');
};

const ABBREVIATION_MATCHERS = [
  isKrakenAbbreviation,
  isStandardEVMAbbreviation,
  isSolanaAbbreviation,
];

export function isAbbreviation(abbreviation: string, fullAddress: string): boolean {
  for (const fn of ABBREVIATION_MATCHERS) {
    if (fn(abbreviation, fullAddress)) return true;
  }
  return false;
}
