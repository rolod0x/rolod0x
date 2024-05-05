import { getMapper } from '@src/shared/address-book';

import { replaceInNodeAndCount, startObserver } from './replacer';
import { initContextMenu } from './contextMenu';

async function initReplacer(): Promise<void> {
  const mapper = await getMapper();

  replaceInNodeAndCount(document.body, mapper.labelMap);
  startObserver(document.body, mapper.labelMap);
}

void initReplacer();
void initContextMenu();
