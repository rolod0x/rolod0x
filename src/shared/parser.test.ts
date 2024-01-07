import { abbreviatedAddresses, zeroPaddedAddress } from './parser';

describe('parser', () => {
  describe('abbreviatedAddresses', () => {
    test('to output an array of abbreviated addresses', () => {
      expect(abbreviatedAddresses('0x6B175474E89094C44Da98b954EedeAC495271d0F')).toEqual([
        '0x6B175474...1d0F',
        '0x6B17...1d0F',
        '0x6B1754...95271d0F',
        '0x6B1...71d0F',
      ]);
    });
  });

  describe('zeroPaddedAddress', () => {
    test('to output an array of two zero-padded addresses', () => {
      expect(zeroPaddedAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')).toEqual([
        '0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
        '0x0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
      ]);
    });
  });
});
