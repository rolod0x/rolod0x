import dedent from 'dedent';

import { Mapper } from './mapper';
import { Parser } from './parser';

describe('Mapper', () => {
  let mapper: Mapper;

  beforeAll(() => {
    const parser = new Parser(dedent`
      0xe3D82337F79306712477b642EF59B75dD62eF109 my label       // ERC-55
      0x1803982898d6a8e832177fca8fd763b9060c3050 another label  // all lowercase
    `);
    mapper = new Mapper();
    mapper.importParsed(parser.parsedEntries);
  });

  it('maps an ERC-55 address originally provided as ERC-55', () => {
    expect(mapper.get('0xe3D82337F79306712477b642EF59B75dD62eF109')).toEqual({
      label: 'my label',
      comment: 'ERC-55',
    });
  });

  it('maps a lowercase address originally provided as ERC-55', () => {
    expect(mapper.get('0xe3d82337f79306712477b642ef59b75dd62ef109')).toEqual({
      label: 'my label',
      comment: 'ERC-55',
    });
  });

  it('maps an ERC-55 address originally provided lowercase', () => {
    expect(mapper.get('0x1803982898d6a8E832177Fca8fD763B9060C3050')).toEqual({
      label: 'another label',
      comment: 'all lowercase',
    });
  });

  it('maps a lowercase address originally provided lowercase', () => {
    expect(mapper.get('0x1803982898d6a8e832177fca8fd763b9060c3050')).toEqual({
      label: 'another label',
      comment: 'all lowercase',
    });
  });

  it("doesn't map address with invalid checksum", () => {
    expect(mapper.get('0x1803982898d6a8E832177Fca8fD763B9060c3050')).toBe(undefined);
  });

  it('maps an address abbreviated 4/4', () => {
    expect(mapper.get('0xe3D8...F109')).toEqual({
      label: 'my label?',
      comment: 'ERC-55',
    });
  });

  it('maps an address abbreviated 6/8', () => {
    expect(mapper.get('0xe3D823...D62eF109')).toEqual({
      label: 'my label?',
      comment: 'ERC-55',
    });
  });

  // In the future we may also map these, if there is a demand for it.
  // However so far sites don't seem to be formatting addresses this way.
  it("doesn't map a lowercase address abbreviated 4/4", () => {
    expect(mapper.get('0xe3d8...f109')).toBe(undefined);
  });

  it("doesn't map a lowercase address abbreviated 6/8", () => {
    expect(mapper.get('0xe3d823...d62ef109')).toBe(undefined);
  });
});
