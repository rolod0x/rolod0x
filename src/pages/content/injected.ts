import { Formatter } from '../../shared/formatter';
import { DEFAULT_OPTIONS, Rolod0xOptions, optionsStorage } from '../../shared/options-storage';
import { Parser, ParseError } from '../../shared/parser';
import { Mapper } from '../../shared/mapper';

import { replaceText, startObserver } from './replacer';

async function init(): Promise<void> {
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

  console.log(`rolod0x: extracted ${parser.parsedEntries.length} parseable lines`);

  const exactFormatter = new Formatter(
    options.displayLabelFormat || DEFAULT_OPTIONS.displayLabelFormat,
  );
  const guessFormatter = new Formatter(
    options.displayGuessFormat || DEFAULT_OPTIONS.displayGuessFormat,
  );
  const mapper = new Mapper(exactFormatter, guessFormatter);
  mapper.importParsed(parser.parsedEntries);

  replaceText(document.body, mapper.labelMap);
  startObserver(document.body, mapper.labelMap);
}

void init();
