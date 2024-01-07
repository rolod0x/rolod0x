import addDomainPermissionToggle from 'webext-domain-permission-toggle';

import 'webext-dynamic-content-scripts';

import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

addDomainPermissionToggle();

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/pages/options/index.html') });
  }
});

console.log('rolod0x: background loaded');
