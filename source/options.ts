// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';

// Don't forget to import this wherever you use it
import browser from 'webextension-polyfill';

import optionsStorage from './options-storage.ts';
import {parseLabels} from './parser.ts';

const bg = browser.extension.getBackgroundPage();

function getLabelsTextarea(): Element {
    return document.querySelector('textarea#labels');
}

const IN_SEPARATE_TAB = true;  // options_ui.open_in_tab from manifest.json
const cons = IN_SEPARATE_TAB ? console : bg.console;

function getLabels(): string {
    const textarea = getLabelsTextarea();
    return textarea.value;

    // const options = await optionsStorage.getAll();
    // return options.labels;
}

async function validate(): Promise<void> {
    const labels = getLabels();

    if (!labels) {
        return;
    }

    const errorDiv = document.querySelector('div#parser-error');
    try {
        cons.log('parsing:', labels.slice(0, 30));
        const labelMap = parseLabels(labels);
        cons.log('parsed', Object.keys(labelMap).length, 'entries');
        errorDiv.style.display = 'none';
    } catch (error: any) {
        cons.error(error);
        errorDiv.innerText = error;
        errorDiv.style.display = 'block';
        cons.log('set error');
    }
}

window.addEventListener('load', validate);
getLabelsTextarea().addEventListener('input', validate);

async function init() {
    await optionsStorage.syncForm('#options-form');
}

init();
