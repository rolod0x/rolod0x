const CONTEXT_MENU_ID = 'rolod0x-context-menu';

function debugClickEvent(
  message: string,
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab,
): void {
  console.log(message);
  console.log('Context menu OnClickData:', info);
  console.log('Tab info:', tab || '<tab undefined>');
}

// Horrible hack to work around https://issues.chromium.org/issues/40375229 -
// see https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
function handleContextMenuClick(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab): void {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    debugClickEvent('Update address book handler ignoring other context menu click', info, tab);
    return;
  }

  if (!info.frameUrl) {
    // This could happen if there's no activeTab permission and the extension hasn't been granted
    // permission to the tab's site.
    debugClickEvent("Can't send update address book message to unknown frame", info, tab);
    return;
  }

  if (info.frameUrl.startsWith('chrome-extension://')) {
    debugClickEvent('NOT sending update address book message to chrome extension', info, tab);
    return;
  }

  console.log('Sending update address book message to tab', info, tab);
  chrome.tabs.sendMessage(
    tab.id,
    'rolod0x update address book', // see src/pages/content/contextMenu.ts
    { frameId: info.frameId },
    // handleResponse
  );
}

// We don't need this since we'll handle the right-click in the content script in the tab:
//
// function handleResponse(data): void {
//   console.log('data: ', data);
// }

export function initContextMenu(): void {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'rolod0x: add entry to address book',
    contexts: ['page', 'selection', 'link'],
    // For some weird reason this can't be set from the service worker; see
    //
    // https://developer.chrome.com/docs/extensions/reference/api/contextMenus#type-CreateProperties
    //
    // onclick: handleContextMenuClick,
  });

  // So we set the handler like this instead:
  chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

  console.log('added context menu item and listener');
}
