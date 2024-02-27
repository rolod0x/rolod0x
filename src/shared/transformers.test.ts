import { zeroPaddedAddress } from './transformers';

describe('zeroPaddedAddress', () => {
  it('outputs an array of four zero-padded addresses', () => {
    expect(zeroPaddedAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')).toEqual([
      '0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
      '0x0000000000000000000000006B175474E89094C44Da98b954EedeAC495271d0F',
      '0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
      '0x0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
    ]);
  });
});
