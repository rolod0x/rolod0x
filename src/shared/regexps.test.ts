import { RE_ADDRESS, RE_BYTES32, RE_ADDRESS_OR_BYTES32 } from './regexps';

const ADDRESS_MATCHES = [
  ['0x6b175474e89094c44da98b954eedeac495271d0f', 'a lowercase address'],
  ['foo 0x6b175474e89094c44da98b954eedeac495271d0f bar', 'a surrounded lowercase address'],

  ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 'matches a mixed case address'],
  ['foo 0x6B175474E89094C44Da98b954EedeAC495271d0F bar', 'matches a mixed case address'],
];

const ADDRESS_NON_MATCHES = [
  [
    'foo0x6B175474E89094C44Da98b954EedeAC495271d0',
    "doesn't match an address immediately following alphanumerics",
  ],
  [
    'foo0x6B175474E89094C44Da98b954EedeAC495271d0 bar',
    "doesn't match an address immediately following alphanumerics",
  ],

  ['0x6B175474E89094C44Da98b954EedeAC495271d0', "doesn't match a truncated address"],
  ['foo 0x6B175474E89094C44Da98b954EedeAC495271d0 bar', "doesn't match a truncated address"],

  ['0x6B175474E89094C44Da98b954EedeAC495271d0F1', "doesn't match an extended address"],
  ['foo 0x6B175474E89094C44Da98b954EedeAC495271d0F1 bar', "doesn't match an extended address"],
];

const BYTES32_MATCHES = [
  [
    '0x6b175474e89094c44da98b954eedeac495271d0f012345678901234567890123',
    'a lowercase 32-byte value',
  ],
  [
    '6b175474e89094c44da98b954eedeac495271d0f012345678901234567890123',
    'a lowercase 32-byte value without 0x',
  ],
  [
    'foo 0x6b175474e89094c44da98b954eedeac495271d0f012345678901234567890123 bar',
    'a surrounded lowercase 32-byte value',
  ],
  [
    'foo 6b175474e89094c44da98b954eedeac495271d0f012345678901234567890123 bar',
    'a surrounded lowercase 32-byte value without 0x',
  ],

  [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123',
    'a mixed case 32-byte value',
  ],
  [
    '6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123',
    'a mixed case 32-byte value without 0x',
  ],
  [
    'foo 0x6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123 bar',
    'a surrounded mixed case 32-byte value',
  ],
  [
    'foo 6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123 bar',
    'a surrounded mixed case 32-byte value without 0x',
  ],
];

const BYTES32_NON_MATCHES = [
  [
    'foo0x6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123 bar',
    "doesn't match a 32-byte value immediately following alphanumerics",
  ],
  [
    'foo6B175474E89094C44Da98b954EedeAC495271d0F012345678901234567890123 bar',
    "doesn't match a 32-byte value without 0x immediately following alphanumerics",
  ],

  ['0x6B175474E89094C44Da98b954EedeAC495271d0', "doesn't match a truncated 32-byte value"],
  [
    'foo 0x6B175474E89094C44Da98b954EedeAC495271d0 bar',
    "doesn't match a surrounded truncated 32-byte value",
  ],

  [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F10123456789012345678901234',
    "doesn't match an extended 32-byte value",
  ],
  [
    'foo 0x6B175474E89094C44Da98b954EedeAC495271d0F10123456789012345678901234 bar',
    "doesn't match a surrounded extended 32-byte value",
  ],
];

describe('RE_ADDRESS', () => {
  for (const [input, descr] of ADDRESS_MATCHES) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_ADDRESS);
    });
  }

  for (const [input, descr] of ADDRESS_NON_MATCHES) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_ADDRESS);
    });
  }
});

describe('RE_BYTES32', () => {
  for (const [input, descr] of BYTES32_MATCHES) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_BYTES32);
    });
  }

  for (const [input, descr] of BYTES32_NON_MATCHES) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_BYTES32);
    });
  }
});

describe('RE_ADDRESS_OR_BYTES32', () => {
  for (const [input, descr] of [...ADDRESS_MATCHES, ...BYTES32_MATCHES]) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_ADDRESS_OR_BYTES32);
    });
  }

  for (const [input, descr] of [...ADDRESS_NON_MATCHES, ...BYTES32_NON_MATCHES]) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_ADDRESS_OR_BYTES32);
    });
  }
});
