import optionsStorage from './options-storage.ts';
import {parseLabels} from './parser.ts';
import {replaceText, startObserver} from './replacer.ts';
import {LabelMap} from './types.ts';

async function init(): Promise<void> {
    const options = await optionsStorage.getAll();
    let labelMap: LabelMap;
    try {
        labelMap = parseLabels(options.labels);
    } catch (err: any) {
        console.error('etherlabel:', err);
    }

    if (labelMap) {
        console.log('got map');
        replaceText(document.body, labelMap);
        startObserver(document.body, labelMap);
    }
}

void init();
