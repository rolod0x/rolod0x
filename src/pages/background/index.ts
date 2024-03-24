import addDomainPermissionToggle from 'webext-permission-toggle';

import 'webext-dynamic-content-scripts';

import { checkPermissions } from '@src/shared/permissions';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

import { initContextMenu } from './contextMenu';

chrome.permissions.onAdded.addListener(() => checkPermissions('onAdded'));
chrome.permissions.onRemoved.addListener(() => checkPermissions('onRemoved'));
// chrome.tabs.onActivated.addListener(() => checkPermissions('tab activated'));
// chrome.tabs.onUpdated.addListener(() => checkPermissions('tab updated'));

checkPermissions('init');
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

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // console.debug('background received msg: ', msg, 'from sender tab', sender.tab);
  switch (msg.text) {
    case 'get tab.id':
      sendResponse({ tabId: sender.tab.id });
      break;
    case 'setBadgeText':
      if (msg.count > 0) {
        const data = { tabId: sender.tab.id, text: String(msg.count) };
        console.debug(`setBadgeText()`, data);
        chrome.action.setBadgeText(data);
      }
      break;
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['src/pages/lookup/index.js'],
  });
});

initContextMenu();

console.log('background service worker finished loading');
