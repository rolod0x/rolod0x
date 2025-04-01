import { getAddress } from 'ethers';
import { isAddress } from '@solana/addresses';

import { Address, Label, Comment, ParsedEntries, AddressType } from './types';

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
  addresses: Address[] = [];
  labels: Record<Address, Label[]> = {};
  comments: Record<Address, Comment[]> = {};
  addressTypes: Record<Address, AddressType> = {};

  constructor(unparsedLabels?: string) {
    if (unparsedLabels) {
      this.parseMultiline(unparsedLabels);
    }
  }

  parseMultiline(unparsedLabels: string): ParsedEntries {
    const lines = unparsedLabels.split('\n');
    lines.forEach((line, lineIndex) => {
      this.parseLine(line, lineIndex);
    });
    return this.parsedEntries;
  }

  private parseLine(line: string, lineIndex: number): void {
    if (/^\s*(\/\/|$)/.test(line)) {
      // Comment or blank line; ignore
      return;
    }

    const isEVM = this.parseEVMLine(line, lineIndex);
    if (isEVM) {
      return;
    }

    const isSolana = this.parseSolanaLine(line, lineIndex);
    if (isSolana) {
      return;
    }

    throw new ParseError(lineIndex + 1);
  }

  private parseLineParts(
    m: RegExpExecArray,
    line: string,
    lineIndex: number,
  ): [string, string, string | undefined] {
    const [_all, address, label, comment] = m;
    if (!address || !label) {
      throw new Error(
        `BUG: parsing issue with line ${lineIndex + 1}; ` +
          `address=${address ?? 'undefined'}, ` +
          `label=${label ?? 'undefined'}:\n` +
          line,
      );
    }
    return [address, label, comment];
  }

  private parseEVMLine(line: string, lineIndex: number): boolean {
    const labelLineRe = /^s*(0x[\da-f]{40})\s+(.+?)(?:\s+\/\/\s*(.*?)\s*)?$/i;
    const m = labelLineRe.exec(line);
    if (!m) {
      return false;
    }

    const [address, label, comment] = this.parseLineParts(m, line, lineIndex);

    let canonical: string;
    try {
      canonical = getAddress(address);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.match(/bad address checksum/)) {
        throw new ParseError(lineIndex + 1, `Bad address checksum`);
      }
      throw err;
    }

    this.addEntry(canonical, 'EVM', label, comment);
    return true;
  }

  private parseSolanaLine(line: string, lineIndex: number): boolean {
    const labelLineRe = /^([1-9A-HJ-NP-Za-km-z]{32,44})\s+(.+?)(?:\s+\/\/\s*(.*?)\s*)?$/;
    const m = labelLineRe.exec(line);
    if (!m) {
      return false;
    }

    const [address, label, comment] = this.parseLineParts(m, line, lineIndex);

    const isSolanaAddress = isAddress(address);
    if (isSolanaAddress) this.addEntry(address, 'Solana', label, comment);
    return isSolanaAddress;
  }

  addEntry(address: Address, addressType: AddressType, label: Label, comment?: Comment): void {
    if (!this.labels[address]) {
      this.addresses.push(address);
    }

    this.addressTypes[address] = addressType;

    this.labels[address] ||= [];
    // The O(n) inclusion check here is suboptimal, but n should be tiny so it's not worth
    // maintaining an ordered dictionary.
    if (!this.labels[address].includes(label)) {
      this.labels[address].push(label);
    }

    if (comment) {
      this.comments[address] ||= [];
      // O(n) again here.
      if (!this.comments[address].includes(comment)) {
        this.comments[address].push(comment);
      }
    }
  }

  get parsedEntries(): ParsedEntries {
    return this.addresses.map(address => {
      return {
        address,
        addressType: this.addressTypes[address],
        label: this.labels[address].join(' / '),
        comment: this.comments[address]?.join(' / '),
      };
    });
  }

  get duplicates(): Address[] {
    return this.addresses.filter(address => this.labels[address]?.length > 1);
  }
}
