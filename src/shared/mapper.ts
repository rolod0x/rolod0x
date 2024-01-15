import { ABBREVIATION_FUNCTIONS } from './abbreviators';
import { Address, AddressLabelComment, LabelComment, LabelMap, ParsedEntries } from './types';

export class Mapper {
  labelMap: LabelMap;
  //  [key: string]: LabelComment;

  constructor() {
    this.labelMap = new Map<Address, LabelComment>();
  }

  importParsed(parsed: ParsedEntries) {
    for (const entry of parsed) {
      this.addEntry(entry);
    }
  }

  addEntry(data: AddressLabelComment) {
    const { address, label, comment } = data;
    const value: LabelComment = { label, comment };

    // data.address is guaranteed to be ERC-55 checksummed
    this.labelMap.set(address, value);
    this.labelMap.set(address.toLowerCase(), value);

    // The abbreviated form has a small risk of collisions,
    // so technically this is "just" a well-educated guess,
    // and we append a suffix to indicate the uncertainty.
    const guess = { label: label + '?', comment };
    for (const func of ABBREVIATION_FUNCTIONS) {
      for (const abbrev of func(address)) {
        this.labelMap.set(abbrev, guess);
      }
    }
  }

  get(s: Address): LabelComment {
    return this.labelMap.get(s);
  }
}
