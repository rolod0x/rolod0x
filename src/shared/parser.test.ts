import { abbreviatedAddresses } from './parser';

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
});