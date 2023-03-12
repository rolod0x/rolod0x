import optionsStorage from './options-storage';
import {parseLabels} from './parser';
import {replaceText, startObserver} from './replacer';
import {LabelMap} from './types';

async function init(): Promise<void> {
    const options = await optionsStorage.getAll();
    let labelMap: LabelMap | undefined;
    try {
        labelMap = parseLabels(options.labels);
    } catch (err: any) {
        console.error('rolod0x:', err);
    }

    if (labelMap) {
        console.log('rolod0x: got label map');
        replaceText(document.body, labelMap);
        startObserver(document.body, labelMap);
    }
}

void init();
