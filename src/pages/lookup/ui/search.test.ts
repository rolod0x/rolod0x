import { ParsedEntries } from '../../../shared/types';

import { itemsFilter } from './search';

describe('itemsFilter', () => {
  const ITEMS: ParsedEntries = [
    {
      address: '0x9991a3369B4292Dc12286c24b596AE0F77Bf841b',
      label: '__My Address__',
    },
    {
      address: '0xA0A89B847819c2989ad5171Bb6c5D4F16E61A5b0',
      label: "someone else's address",
    },
    {
      address: '0x05594919ac646e6fF9f704edb9910Cb310841739',
      label: 'my multisig',
    },
  ];

  const TEST_CASES: [string, number[]][] = [
    ['', [0, 1, 2]],
    ['   ', [0, 1, 2]],
    ['foobar', []],
    ['multi', [2]],
    ["'", [1]],
    ["'", [1]],
    ['0xA0A8', [1]],
    ['0xa0a8', [1]],
    ['fF9f70', [2]],
    ['ff9f70', [2]],
    ['my Multi', [2]],
    ['my uLTI', [2]],
    ['ulti my', [2]],
    ['my', [0, 2]],
    ['addr', [0, 1]],
    ['one addr', [1]],
  ];

  TEST_CASES.forEach(testcase => {
    const [search, indices] = testcase;
    it(`finds ${indices.length} match(es) containing "${search}"'`, () => {
      expect(itemsFilter(ITEMS, { inputValue: search })).toEqual(indices.map(i => ITEMS[i]));
    });
  });
});
