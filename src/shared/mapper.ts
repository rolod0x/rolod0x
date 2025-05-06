import { ABBREVIATION_FUNCTIONS } from './abbreviators';
import { TRANSFORMER_FUNCTIONS } from './transformers';
import { Formatter } from './formatter';
import { Address, AddressLabelComment, LabelComment, LabelMap, ParsedEntries } from './types';
import './console';

export class Mapper {
  exactFormatter: Formatter;
  guessFormatter: Formatter;
  labelMap: LabelMap;
  //  [key: string]: LabelComment;

  constructor(exact: Formatter, guess: Formatter) {
    this.labelMap = new Map<Address, LabelComment>();
    this.exactFormatter = exact;
    this.guessFormatter = guess;
  }

  importParsed(parsed: ParsedEntries) {
    const start = new Date();
    let i = 0;
    for (const entry of parsed) {
      this.addEntry(entry);
      i++;
    }
    const duration = new Date().getTime() - start.getTime();
    console.ldebug(`rolod0x: imported ${i} parsed entries in ${duration}ms`);
  }

  addEntry(data: AddressLabelComment) {
    const { address, addressType, label, comment } = data;

    const value: LabelComment = {
      label: this.exactFormatter.format(label, address, addressType),
      comment,
    };

    // data.address is guaranteed to be ERC-55 checksummed
    this.labelMap.set(address, value);
    this.labelMap.set(address.toLowerCase(), value);

    for (const func of TRANSFORMER_FUNCTIONS) {
      for (const transformed of func(address, addressType)) {
        this.labelMap.set(transformed, value);
        this.labelMap.set(transformed.toLowerCase(), value);
      }
    }

    // The abbreviated form has a small risk of collisions,
    // so technically this is "just" a well-educated guess,
    // and we append a suffix to indicate the uncertainty.
    const guess = { label: this.guessFormatter.format(label, address, addressType), comment };
    for (const func of ABBREVIATION_FUNCTIONS[addressType]) {
      for (const abbrev of func(address)) {
        this.labelMap.set(abbrev, guess);
        this.labelMap.set(abbrev.toLowerCase(), guess);
      }
    }
  }

  get(s: Address): LabelComment {
    return this.labelMap.get(s);
  }
}
