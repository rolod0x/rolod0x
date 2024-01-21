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
    return this.formatString
      .replace('%n', label)
      .replace(/%(\d+)l/, (_match, digits) => address.replace(/^0x/, '').slice(0, Number(digits)))
      .replace(/%(\d+)r/, (_match, digits) => address.replace(/^0x/, '').slice(-Number(digits)));
  }
}
