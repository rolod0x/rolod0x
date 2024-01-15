import { getAddress } from 'ethers';

import { ParsedEntries } from './types';

export class ParseError extends Error {
  lineNumber: number;
  message: string;

  constructor(
    public readonly _lineNumber: number,
    public readonly _message?: string,
  ) {
    const m = (_message || 'Parsing failed') + ` on line ${_lineNumber}`;
    super(m);
    this.message = m;
    Object.setPrototypeOf(this, new.target.prototype);
    this.lineNumber = _lineNumber;
  }
}

export class Parser {
  parsedEntries: ParsedEntries = [];

  constructor(unparsedLabels?: string) {
    if (unparsedLabels) {
      this.parseMultiline(unparsedLabels);
    }
  }

  parseMultiline(unparsedLabels: string): ParsedEntries {
    const labelLineRe = /^s*(0x[\da-f]{40})\s+(.+?)(?:\s+\/\/\s*(.*?)\s*)?$/i;
    const lines = unparsedLabels.split('\n');
    lines.forEach((line, i) => {
      if (/^\s*(\/\/|$)/.test(line)) {
        // Comment or blank line; ignore
        return;
      }

      const m = labelLineRe.exec(line);
      if (m) {
        const [_all, address, label, comment] = m;
        if (address && label) {
          let canonical: string;
          try {
            canonical = getAddress(address);
          } catch (err: unknown) {
            if (err instanceof Error && err.message.match(/bad address checksum/)) {
              throw new ParseError(i + 1, `Bad address checksum`);
            }
            throw err;
          }
          this.parsedEntries.push({
            address: canonical,
            label,
            comment,
          });
          return;
        }

        throw new Error(
          `BUG: parsing issue with line ${i + 1}; ` +
            `address=${address ?? 'undefined'}, ` +
            `label=${label ?? 'undefined'}:\n` +
            line,
        );
      }

      throw new ParseError(i + 1);
    });

    return this.parsedEntries;
  }
}
