import { getMapper } from '@src/shared/address-book';

import { replaceInNodeAndCount, startObserver } from './replacer';
import { initContextMenu } from './contextMenu';

async function initReplacer(): Promise<void> {
  const mapper = await getMapper();
  const counter = { count: 0 };

  replaceInNodeAndCount(document.body, mapper.labelMap, counter);
  startObserver(document.body, mapper.labelMap, counter);
}

void initReplacer();
void initContextMenu();
