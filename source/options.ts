// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';

// Don't forget to import this wherever you use it
import browser from 'webextension-polyfill';

import optionsStorage from './options-storage';
import {parseLabels} from './parser';

const bg = browser.extension.getBackgroundPage();

function getLabelsTextarea(): HTMLElement | null {
    return document.querySelector('textarea#labels');
}

const IN_SEPARATE_TAB = true;  // options_ui.open_in_tab from manifest.json
const cons = IN_SEPARATE_TAB ? console : bg.console;

function getLabels(): string | null {
    const textarea = getLabelsTextarea();
    if (textarea) {
        cons.table(Object.keys(textarea));
    }
    return textarea?.value;

    // const options = await optionsStorage.getAll();
    // return options.labels;
}

async function validate(): Promise<void> {
    const labels = getLabels();

    if (!labels) {
        return;
    }

    const errorDiv = document.querySelector<HTMLElement>('div#parser-error');
    try {
        cons.log('parsing:', labels.slice(0, 30));
        const labelMap = parseLabels(labels);
        cons.log('parsed', Object.keys(labelMap).length, 'entries');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    } catch (error: any) {
        cons.error(error);
        if (errorDiv) {
            errorDiv.innerText = error;
            errorDiv.style.display = 'block';
        }
        cons.log('set error');
    }
}

window.addEventListener('load', validate);
const textarea = getLabelsTextarea();
if (textarea) {
    textarea.addEventListener('input', validate);
}

async function init() {
    await optionsStorage.syncForm('#options-form');
}

init();
