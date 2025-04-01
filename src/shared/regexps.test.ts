import {
  RE_EVM_ADDRESS,
  RE_EVM_BYTES32,
  RE_EVM_ADDRESS_OR_BYTES32,
  RE_SOLANA_ADDRESS,
} from './regexps';

const EVM_ADDRESS_MATCHES = [
  ['0x6b175474e89094c44da98b954eedeac495271d0f', 'a lowercase address'],
  ['foo 0x6b175474e89094c44da98b954eedeac495271d0f bar', 'a surrounded lowercase address'],

  ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 'matches a mixed case address'],
  ['foo 0x6B175474E89094C44Da98b954EedeAC495271d0F bar', 'matches a mixed case address'],
];

const EVM_ADDRESS_NON_MATCHES = [
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

const EVM_BYTES32_MATCHES = [
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

const EVM_BYTES32_NON_MATCHES = [
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

const SOLANA_MATCHES = [
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK', 'a standard Solana address'],
  ['foo DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK bar', 'a surrounded Solana address'],
  ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'the SPL token program ID'],
  ['ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', 'the ATA program ID'],
];

const SOLANA_NON_MATCHES = [
  ['abcd', 'too short'],
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK1', 'too long'],
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSK0', 'contains invalid character 0'],
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKl', 'contains invalid character l'],
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKI', 'contains invalid character I'],
  ['DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKOO', 'contains invalid character O'],
];

describe('RE_EVM_ADDRESS', () => {
  for (const [input, descr] of EVM_ADDRESS_MATCHES) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_EVM_ADDRESS);
    });
  }

  for (const [input, descr] of EVM_ADDRESS_NON_MATCHES) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_EVM_ADDRESS);
    });
  }
});

describe('RE_EVM_BYTES32', () => {
  for (const [input, descr] of EVM_BYTES32_MATCHES) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_EVM_BYTES32);
    });
  }

  for (const [input, descr] of EVM_BYTES32_NON_MATCHES) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_EVM_BYTES32);
    });
  }
});

describe('RE_SOLANA_ADDRESS', () => {
  for (const [input, descr] of SOLANA_MATCHES) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_SOLANA_ADDRESS);
    });
  }

  for (const [input, descr] of SOLANA_NON_MATCHES) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_SOLANA_ADDRESS);
    });
  }
});

describe('RE_EVM_ADDRESS_OR_BYTES32', () => {
  for (const [input, descr] of [...EVM_ADDRESS_MATCHES, ...EVM_BYTES32_MATCHES]) {
    it(`matches ${descr}`, () => {
      expect(input).toMatch(RE_EVM_ADDRESS_OR_BYTES32);
    });
  }

  for (const [input, descr] of [...EVM_ADDRESS_NON_MATCHES, ...EVM_BYTES32_NON_MATCHES]) {
    it(`doesn't match ${descr}`, () => {
      expect(input).not.toMatch(RE_EVM_ADDRESS_OR_BYTES32);
    });
  }
});
