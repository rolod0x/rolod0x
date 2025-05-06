import {
  abbreviatedEVMAddresses,
  abbreviatedSolanaAddresses,
  isAbbreviation,
  krakenAbbreviation,
} from './abbreviators';

const FULL_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const SOLANA_ADDRESS = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';

const EXPECTED_ETH_ABBREVIATIONS = [
  '0x6B175474...1d0F',
  '0x6B175474E8...1d0F',
  '0x6B1754...271d0F',
  '0x6B17...1d0F',
  '0x6B17...271d0F',
  '0x6B175474...C495271d0F',
  '0x6B1754...71d0F',
  '0x6B1754...95271d0F',
  '0x6B175474...495271d0F',
  '0x6B1...71d0F',
  '0x6B...1d0F',
  '0x6B17...C495271d0F',
  '0x6B175474E89094C44Da98b954EedeA',
];

const EXPECTED_SOLANA_ABBREVIATIONS = [
  'DYw8jCTfwH...KUmG5CNSKK',
  'DYw8jC...5CNSKK',
  'DYw8j...CNSKK',
  'DYw8...NSKK',
];

const INVALID_ETH_ABBREVIATIONS = [
  '0x6B175474...1d0',
  '0xB175474E8...1d0F',
  '0x6B7...1d0F',
  '0x6b1754...71d0F',
  '0x6B1754...95271d0f',
  '0x6b1754..95271d0F',
  '0x6B175474...',
  '1x6B1...71d0F',
  '00x6B...1d0F',
  '0x6B1...d0FG',
  '0x',
  'foobar',
];

const INVALID_SOLANA_ABBREVIATIONS = [
  'DYw8jCTfwH...UmG5CNSK',
  'DYw8jC...5CNSKKK',
  'DYw8j...CNSK',
  'DYw8...NSK',
  'DYw8jCTfwH..UmG5CNSKK',
  'dyw8jCTfwH...UmG5CNSKK',
  'DYw8jCTfwH...',
  '...UmG5CNSKK',
  'DYw8jCTfwH...UmG5CNSKKK',
  'DYw8jCTfwH...UmG5CNSK',
  '',
  'foobar',
];

describe('abbreviatedEVMAddresses()', () => {
  it('outputs an array of abbreviated addresses', () => {
    const abbrevs = abbreviatedEVMAddresses(FULL_ADDRESS);
    expect(abbrevs).toEqual(EXPECTED_ETH_ABBREVIATIONS);
  });
});

describe('abbreviatedSolanaAddresses()', () => {
  it('outputs an array of abbreviated Solana addresses', () => {
    const abbrevs = abbreviatedSolanaAddresses(SOLANA_ADDRESS);
    expect(abbrevs).toEqual(EXPECTED_SOLANA_ABBREVIATIONS);
  });
});

describe('krakenAbbreviation()', () => {
  it('abbreviates addresses in Kraken style', () => {
    expect(krakenAbbreviation(FULL_ADDRESS)).toBe('0x6B 1754 ... 9527 1d0F');
  });
});

describe('isAbbreviation()', () => {
  for (const abbrev of EXPECTED_ETH_ABBREVIATIONS) {
    it(`detects ${abbrev} as a valid abbreviation of ${FULL_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev, FULL_ADDRESS)).toBe(true);
    });

    it(`detects ${abbrev.toLowerCase()} as a valid abbreviation of ${FULL_ADDRESS.toLowerCase()}`, () => {
      expect(isAbbreviation(abbrev.toLowerCase(), FULL_ADDRESS.toLowerCase())).toBe(true);
    });

    it(`detects ${abbrev.toLowerCase()} as an invalid abbreviation of ${FULL_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev.toLowerCase(), FULL_ADDRESS)).toBe(false);
    });
  }

  for (const abbrev of EXPECTED_SOLANA_ABBREVIATIONS) {
    it(`detects ${abbrev} as a valid Solana abbreviation of ${SOLANA_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev, SOLANA_ADDRESS)).toBe(true);
    });

    it(`detects ${abbrev.toLowerCase()} as a valid Solana abbreviation of ${SOLANA_ADDRESS.toLowerCase()}`, () => {
      expect(isAbbreviation(abbrev.toLowerCase(), SOLANA_ADDRESS.toLowerCase())).toBe(true);
    });

    it(`detects ${abbrev.toLowerCase()} as an invalid Solana abbreviation of ${SOLANA_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev.toLowerCase(), SOLANA_ADDRESS)).toBe(false);
    });
  }

  for (const abbrev of INVALID_ETH_ABBREVIATIONS) {
    it(`detects ${abbrev} as an invalid abbreviation of ${FULL_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev, FULL_ADDRESS)).toBe(false);
    });
  }

  it('recognizes Kraken-style abbreviations', () => {
    expect(isAbbreviation('0x6B 1754 ... 9527 1d0F', FULL_ADDRESS)).toBe(true);
  });

  for (const abbrev of INVALID_SOLANA_ABBREVIATIONS) {
    it(`detects ${abbrev} as an invalid Solana abbreviation of ${SOLANA_ADDRESS}`, () => {
      expect(isAbbreviation(abbrev, SOLANA_ADDRESS)).toBe(false);
    });
  }
});
