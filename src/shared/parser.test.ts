import dedent from 'dedent';

import { ParseError, Parser } from './parser';

describe('ParseError', () => {
  it('outputs an error message with the line number', () => {
    // Super lame that jest doesn't allow further tests on the error thrown!
    // https://github.com/jestjs/jest/issues/8698
    expect(() => {
      throw new ParseError(42, 'oopsie');
    }).toThrow('oops');

    expect.assertions(5);

    // So instead do the expectations inside catch {...}
    try {
      throw new ParseError(42, 'oopsie');
    } catch (err) {
      expect(err).toBeInstanceOf(ParseError);
      expect(err.message).toMatch('oopsie on line 42');
      expect(err.lineNumber).toEqual(42);
      expect(err.toString()).toEqual('Error: oopsie on line 42');
    }
  });
});

describe('Parser', () => {
  it('parses the empty string', () => {
    const parser = new Parser('');
    expect(parser.parsedEntries.length).toEqual(0);
  });

  it('parses an empty line', () => {
    const parser = new Parser('\n');
    expect(parser.parsedEntries.length).toEqual(0);
  });

  it('parses a comment line', () => {
    const parser = new Parser('// foo bar\n');
    expect(parser.parsedEntries.length).toEqual(0);
  });

  it('errors on an unparseable line', () => {
    expect(() => {
      new Parser('foo');
    }).toThrow();
    try {
      new Parser('foo');
    } catch (err) {
      expect(err).toBeInstanceOf(ParseError);
      expect(err.message).toMatch('Parsing failed on line 1');
      expect(err.lineNumber).toEqual(1);
    }
  });

  it('parses a single ERC-55 entry', () => {
    const parser = new Parser(dedent`
      // foo bar
      0x1803982898d6a8E832177Fca8fD763B9060C3050 my label
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'my label',
        comment: undefined,
      },
    ]);
  });

  it('parses a single lowercase entry', () => {
    const parser = new Parser(dedent`
      // foo bar
      0x1803982898d6a8e832177fca8fd763b9060c3050 my label
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'my label',
        comment: undefined,
      },
    ]);
  });

  it('errors on a line with invalid ERC-55 checksum', () => {
    expect(() => {
      new Parser(dedent`
        // foo bar
        0x1803982898d6a8E832177Fca8fD763b9060C3050 my label
      `);
    }).toThrow('Bad address checksum on line 2');
  });

  it('parses a mix of lines', () => {
    const unparsed = dedent`

      // foo bar
      0x1803982898d6a8e832177fca8fd763b9060c3050 my label   // extra comment here

      0xe3D82337F79306712477b642EF59B75dD62eF109   / another label, no comment /


      // blah blah
      // end of file
    `;
    const parser = new Parser();
    parser.parseMultiline(unparsed);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'my label',
        comment: 'extra comment here',
      },
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: '/ another label, no comment /',
        comment: undefined,
      },
    ]);
  });

  it('parses duplicate addresses with no comments', () => {
    const parser = new Parser(dedent`
      // a comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 first
      0x1803982898d6a8E832177Fca8fD763B9060C3050 another address
      // another comment
      0xe3D82337F79306712477b642EF59B75dD62eF109   duplicate 1
      0xe3D82337F79306712477b642EF59B75dD62eF109 duplicate 2
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: 'first / duplicate 1 / duplicate 2',
        comment: undefined,
      },
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'another address',
        comment: undefined,
      },
    ]);
    expect(parser.duplicates).toEqual(['0xe3D82337F79306712477b642EF59B75dD62eF109']);
  });

  it('ignores duplicate labels', () => {
    const parser = new Parser(dedent`
      // a comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 first
      0x1803982898d6a8E832177Fca8fD763B9060C3050 another address
      // another comment
      0xe3D82337F79306712477b642EF59B75dD62eF109   duplicate 1
      0xe3D82337F79306712477b642EF59B75dD62eF109 first
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: 'first / duplicate 1',
        comment: undefined,
      },
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'another address',
        comment: undefined,
      },
    ]);
    expect(parser.duplicates).toEqual(['0xe3D82337F79306712477b642EF59B75dD62eF109']);
  });

  it('parses duplicate addresses with one comment', () => {
    const parser = new Parser(dedent`
      0x14dc79964da2c08b23698b3d3cc7ca32193d9955 a lowercase address
      // a comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 label one   // comment on first
      0x1803982898d6a8E832177Fca8fD763B9060C3050   another address
      // another comment
      0xe3D82337F79306712477b642EF59B75dD62eF109  label two for same address
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        addressType: 'EVM',
        label: 'a lowercase address',
        comment: undefined,
      },
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: 'label one / label two for same address',
        comment: 'comment on first',
      },
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'another address',
        comment: undefined,
      },
    ]);
    expect(parser.duplicates).toEqual(['0xe3D82337F79306712477b642EF59B75dD62eF109']);
  });

  it('parses duplicate addresses with two comments', () => {
    const parser = new Parser(dedent`
      0x14dc79964da2c08b23698b3d3cc7ca32193d9955 a lowercase address
      // a comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 label one // 1st comment
      0x1803982898d6a8E832177Fca8fD763B9060C3050 another address
      // another comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 label two    //  2nd comment
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        addressType: 'EVM',
        label: 'a lowercase address',
        comment: undefined,
      },
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: 'label one / label two',
        comment: '1st comment / 2nd comment',
      },
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'another address',
        comment: undefined,
      },
    ]);
    expect(parser.duplicates).toEqual(['0xe3D82337F79306712477b642EF59B75dD62eF109']);
  });

  it('ignores duplicate comments', () => {
    const parser = new Parser(dedent`
      0x14dc79964da2c08b23698b3d3cc7ca32193d9955 a lowercase address
      // a comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 label one // comment
      0x1803982898d6a8E832177Fca8fD763B9060C3050 another address
      // another comment
      0xe3D82337F79306712477b642EF59B75dD62eF109 label two    //   comment
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        addressType: 'EVM',
        label: 'a lowercase address',
        comment: undefined,
      },
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        addressType: 'EVM',
        label: 'label one / label two',
        comment: 'comment',
      },
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'another address',
        comment: undefined,
      },
    ]);
    expect(parser.duplicates).toEqual(['0xe3D82337F79306712477b642EF59B75dD62eF109']);
  });

  it('parses a single Solana address', () => {
    const parser = new Parser(
      'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK my solana label // comment',
    );
    expect(parser.parsedEntries).toEqual([
      {
        address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        addressType: 'Solana',
        label: 'my solana label',
        comment: 'comment',
      },
    ]);
  });

  it('parses mixed EVM and Solana addresses', () => {
    const parser = new Parser(dedent`
      0x1803982898d6a8E832177Fca8fD763B9060C3050 evm label // evm comment
      DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK solana label // sol comment
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '0x1803982898d6a8E832177Fca8fD763B9060C3050',
        addressType: 'EVM',
        label: 'evm label',
        comment: 'evm comment',
      },
      {
        address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
        addressType: 'Solana',
        label: 'solana label',
        comment: 'sol comment',
      },
    ]);
  });

  it('parses multiple Solana addresses of various types', () => {
    const parser = new Parser(dedent`
      7vJ3mSPgKnnHSyHx5JKnwqL4gYbEuGBJ4KXJGE9kBUkj wallet address // personal wallet
      5TeGDBFiXs3YtGzg5MQKp7PVxgpm5TxqHMxGsiBKp5dB program v1
      TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA token program // SPL token
      ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL associated token // ATA program
    `);
    expect(parser.parsedEntries).toEqual([
      {
        address: '7vJ3mSPgKnnHSyHx5JKnwqL4gYbEuGBJ4KXJGE9kBUkj',
        addressType: 'Solana',
        label: 'wallet address',
        comment: 'personal wallet',
      },
      {
        address: '5TeGDBFiXs3YtGzg5MQKp7PVxgpm5TxqHMxGsiBKp5dB',
        addressType: 'Solana',
        label: 'program v1',
        comment: undefined,
      },
      {
        address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        addressType: 'Solana',
        label: 'token program',
        comment: 'SPL token',
      },
      {
        address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        addressType: 'Solana',
        label: 'associated token',
        comment: 'ATA program',
      },
    ]);
  });
});
