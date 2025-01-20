import { zeroPaddedAddress } from './transformers';

describe('zeroPaddedAddress', () => {
  it('outputs an array of four zero-padded addresses', () => {
    expect(zeroPaddedAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')).toEqual([
      '0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
      '0x0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
    ]);
  });

  it('outputs an empty array for an invalid address', () => {
    expect(zeroPaddedAddress('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK')).toEqual([]);
  });
});
