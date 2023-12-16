import { Rolod0xOptions, optionsStorage } from '../../shared/options-storage';
import { parseLabels } from '../../shared/parser';
import { replaceText, startObserver } from './replacer';
import { LabelMap } from '../../shared/types';

async function init(): Promise<void> {
  const options: Rolod0xOptions = await optionsStorage.getAll();
  let labelMap: LabelMap | undefined;
  let linesParsed: number;
  try {
    [linesParsed, labelMap] = parseLabels(options.labels);
  } catch (err: unknown) {
    console.error('rolod0x:', err);
  }

  if (labelMap) {
    console.log(`rolod0x: got label map from ${linesParsed} parseable lines`);
    replaceText(document.body, labelMap);
    startObserver(document.body, labelMap);
  }
}

void init();
