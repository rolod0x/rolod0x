import dedent from 'dedent';

import { Formatter } from './formatter';
import { Mapper } from './mapper';
import { Parser } from './parser';

describe('Mapper', () => {
  let mapper: Mapper;

  beforeAll(() => {
    const parser = new Parser(dedent`
      0xe3D82337F79306712477b642EF59B75dD62eF109 my label       // ERC-55
      0x1803982898d6a8e832177fca8fd763b9060c3b5d another label  // all lowercase
    `);
    const exact = new Formatter('%n | %4r');
    const guess = new Formatter('?%n? %4r');
    mapper = new Mapper(exact, guess);
    mapper.importParsed(parser.parsedEntries);
  });

  it('maps an ERC-55 address originally provided as ERC-55', () => {
    expect(mapper.get('0xe3D82337F79306712477b642EF59B75dD62eF109')).toEqual({
      label: 'my label | F109',
      comment: 'ERC-55',
    });
  });

  it('maps a lowercase address originally provided as ERC-55', () => {
    expect(mapper.get('0xe3d82337f79306712477b642ef59b75dd62ef109')).toEqual({
      label: 'my label | F109',
      comment: 'ERC-55',
    });
  });

  it('maps an ERC-55 address originally provided lowercase', () => {
    expect(mapper.get('0x1803982898d6A8E832177FCA8FD763B9060c3B5d')).toEqual({
      label: 'another label | 3B5d',
      comment: 'all lowercase',
    });
  });

  it('maps a lowercase address originally provided lowercase', () => {
    expect(mapper.get('0x1803982898d6a8e832177fca8fd763b9060c3b5d')).toEqual({
      label: 'another label | 3B5d',
      comment: 'all lowercase',
    });
  });

  it("doesn't map address with invalid checksum", () => {
    expect(mapper.get('0x1803982898d6a8E832177Fca8fD763B9060c3b5d')).toBe(undefined);
  });

  it('maps an address abbreviated 4/4', () => {
    expect(mapper.get('0xe3D8...F109')).toEqual({
      label: '?my label? F109',
      comment: 'ERC-55',
    });
  });

  it('maps an address abbreviated 4/4 lowercase', () => {
    expect(mapper.get('0xe3d8...f109')).toEqual({
      label: '?my label? F109',
      comment: 'ERC-55',
    });
  });

  it('maps an address abbreviated 4/4 lowercase', () => {
    expect(mapper.get('0x1803...3b5d')).toEqual({
      label: '?another label? 3B5d',
      comment: 'all lowercase',
    });
  });

  it('maps an address abbreviated 6/8', () => {
    expect(mapper.get('0xe3D823...D62eF109')).toEqual({
      label: '?my label? F109',
      comment: 'ERC-55',
    });
  });

  it('maps an address abbreviated 6/8 lowercase', () => {
    expect(mapper.get('0xe3d823...d62ef109')).toEqual({
      label: '?my label? F109',
      comment: 'ERC-55',
    });
  });

  it('maps an address abbreviated 6/8 lowercase', () => {
    expect(mapper.get('0x180398...060c3b5d')).toEqual({
      label: '?another label? 3B5d',
      comment: 'all lowercase',
    });
  });
});
