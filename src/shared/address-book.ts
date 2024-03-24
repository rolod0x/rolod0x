import { DEFAULT_OPTIONS, Rolod0xOptions, optionsStorage } from '@src/shared/options-storage';
import { Formatter } from '@src/shared/formatter';
import { Mapper } from '@src/shared/mapper';
import { Parser, ParseError } from '@src/shared/parser';

export async function getMapper(): Promise<Mapper> {
  const options: Rolod0xOptions = await optionsStorage.getAll();
  const parser = new Parser();
  try {
    parser.parseMultiline(options.labels);
  } catch (err: unknown) {
    if (err instanceof ParseError) {
      console.log('rolod0x:', err);
    } else {
      console.error('rolod0x:', err);
    }
  }

  // console.debug(`rolod0x: extracted ${parser.parsedEntries.length} parseable lines`);

  const exactFormatter = new Formatter(
    options.displayLabelFormat || DEFAULT_OPTIONS.displayLabelFormat,
  );
  const guessFormatter = new Formatter(
    options.displayGuessFormat || DEFAULT_OPTIONS.displayGuessFormat,
  );
  const mapper = new Mapper(exactFormatter, guessFormatter);
  mapper.importParsed(parser.parsedEntries);

  return mapper;
}

// address is assumed to be in valid format
export async function isNewAddress(address: string): Promise<boolean> {
  const mapper = await getMapper();
  const data = mapper.get(address);
  if (data) {
    console.log(`rolod0x: Address ${address} already in address book`);
    return false;
  }

  return true;
}

export async function addNewEntry(address: string, label: string, comment?: string): Promise<void> {
  const options: Rolod0xOptions = await optionsStorage.getAll();
  let labels = options.labels + `\n${address} ${label}`;
  if (comment) {
    labels += ` // ${comment}`;
  }
  await optionsStorage.set({ labels });
}
