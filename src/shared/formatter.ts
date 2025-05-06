import { Label, Address, AddressType } from './types';

export function extractAddressDigits(address: Address, start: number, end: number): string {
  return address.replace(/^0x/, '').slice(start, end);
}

export class Formatter {
  formatString: string;

  constructor(_formatString: string) {
    this.formatString = _formatString;
  }

  format(label: Label, address: Address, addressType: AddressType): string {
    const trimmed = address.replace(/^0x/, '');
    return this.formatString
      .replace('%n', label)
      .replace('%a', address)
      .replace(/%(\d+)l/, (_match, digits) =>
        this.sliceAddressStart(address, addressType, Number(digits)),
      )
      .replace(/%(\d+)r/, (_match, digits) => trimmed.slice(-Number(digits)))
      .replaceAll(/%(-?\d+)i(\d+)/g, (_match, offset, length) => {
        const startAt = Number(offset) < 0 ? trimmed.length + Number(offset) : Number(offset);
        return trimmed.slice(startAt, startAt + Number(length));
      });
  }

  sliceAddressStart(address: Address, addressType: AddressType, digits: number): string {
    let addressString = address.replace(/^0x/, '').slice(0, Number(digits));

    const isFormattedEVMAddress = addressType === 'EVM' && address.startsWith('0x');
    if (isFormattedEVMAddress) {
      addressString = '0x' + addressString;
    }

    return addressString;
  }
}
