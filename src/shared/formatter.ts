import { Label, Address } from './types';

export function extractAddressDigits(address: Address, start: number, end: number): string {
  return address.replace(/^0x/, '').slice(start, end);
}

export class Formatter {
  formatString: string;

  constructor(_formatString: string) {
    this.formatString = _formatString;
  }

  format(label: Label, address: Address): string {
    const prefix = address.startsWith('0x') ? '0x' : '';
    const trimmed = address.replace(/^0x/, '');
    // Substitute in a single pass over the format string, so that text inserted
    // for one code (a label, say) is never scanned for the others, and the
    // callback's return value is inserted verbatim, with no `$` patterns.
    return this.formatString.replaceAll(
      /%(?:([pna])|(\d+)([lr])|(-?\d+)i(\d+))/g,
      (_match, code, digits, side, offset, length) => {
        if (code === 'p') return prefix;
        if (code === 'n') return label;
        if (code === 'a') return address;
        if (side === 'l') return trimmed.slice(0, Number(digits));
        if (side === 'r') return trimmed.slice(-Number(digits));
        const startAt = Number(offset) < 0 ? trimmed.length + Number(offset) : Number(offset);
        return trimmed.slice(startAt, startAt + Number(length));
      },
    );
  }
}
