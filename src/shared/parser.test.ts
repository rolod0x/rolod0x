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
        label: 'my label',
        comment: 'extra comment here',
      },
      {
        address: '0xe3D82337F79306712477b642EF59B75dD62eF109',
        label: '/ another label, no comment /',
        comment: undefined,
      },
    ]);
  });
});
