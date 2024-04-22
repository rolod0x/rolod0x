import * as browser from 'webextension-polyfill';

export function displayLookup(tabId: number): void {
  browser.scripting.executeScript({
    target: { tabId },

    // files need to be relative to the extension root as per:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript#file
    files: ['/src/pages/lookup/index.js'],
  });
}
