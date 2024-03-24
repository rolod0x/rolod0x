import { getCanonicalAddress } from '@src/shared/address';
import { getMapper, isNewAddress } from '@src/shared/address-book';
// import { getBadgeText } from '@src/shared/badge';
import { RE_ADDRESS } from '@src/shared/searcher';
import { Counter } from '@src/shared/types';

import { replaceInNodeAndCount } from './replacer';

const IFRAME_URL = 'src/pages/content/contextMenu/index.html';

let clickedEl: HTMLElement = null;

async function addLabelForClickedElement(): Promise<void> {
  // const options: Rolod0xOptions = await optionsStorage.getAll();
  console.debug('rolod0x: Right-clicked on', clickedEl);

  let url = IFRAME_URL;

  const match = clickedEl.outerHTML?.match(RE_ADDRESS);
  if (match) {
    const address = match[0];
    const canonical = getCanonicalAddress(address);
    if (!canonical) {
      console.log(`rolod0x: Invalid address ${address}`);
      return;
    }

    const isNew = await isNewAddress(address);
    if (isNew) {
      console.debug('rolod0x: Found address in element:', canonical);
      url += `?address=${canonical}`;
    }
  } else {
    console.debug('rolod0x: No address found in:', clickedEl.outerHTML);
  }

  rolod0x_iframe_init({
    id: 'update',
    url,
    title: 'rolod0x: update address book',
    width: '80%',
    height: '80%',
    closeAction: 'remove',
    updateHandler,
  });
}

async function updateHandler() {
  const mapper = await getMapper();
  const count = 0; // FIXME await getBadgeText();
  const counter: Counter = { count: Number(count) ?? 0 };
  replaceInNodeAndCount(document.body, mapper.labelMap, counter);
}

export function initContextMenu(): void {
  // We only have access to the element that's been clicked when the context menu is first opened.
  // Remember it for use later.

  document.addEventListener(
    'contextmenu',
    event => {
      clickedEl = event.target as HTMLElement;
      // console.debug('rolod0x: Updated last right-clicked element:', clickedEl);
    },

    // useCapture - the event listener is triggered in the capturing phase, before reaching the
    // target element:
    true,
    // False (the default) means that the event listener is triggered in the bubbling phase, after
    // the event has reached the target element.
    //
    // FIXME: Not sure if it makes any difference which we use here.
  );

  // Runs when the context menu item is actually clicked.
  chrome.runtime.onMessage.addListener((event, _sender, sendResponse) => {
    // see src/pages/background/contextMenu.ts
    if (event === 'rolod0x update address book') {
      console.debug(
        'rolod0x: Received add label request from background service worker:',
        clickedEl,
      );
      addLabelForClickedElement();

      if (sendResponse) {
        sendResponse({ clickedElementHTML: clickedEl.innerHTML });
      }
      // This is another way of sending the element back to the background service worker:
      //
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      // chrome.runtime.sendMessage({
      //   command: 'foo',
      //   sender: 'contextMenuHandler',
      //   element: clickedEl,
      // });
    }
  });

  console.debug('rolod0x: init context menu in content script');
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! FIXME: The below code is duplicated with src/pages/lookup/index.ts
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

interface IframeParams {
  id: string;
  containerId?: string;
  url: string;
  title: string;
  width: string;
  height: string;
  // Whether to hide the iframe on close, or remove it from the DOM.
  closeAction: 'hide' | 'remove';
  updateHandler?: () => Promise<void>;
}

function rolod0x_iframe_init(params: IframeParams): void {
  const containerId = `rolod0x-${params.id}-iframe-container`;
  if (document.getElementById(containerId)) {
    setIframeVisibility(containerId, true);
  } else {
    newContainer({ containerId, ...params });
  }
}

function newContainer(params: IframeParams): HTMLDivElement {
  const container: HTMLDivElement = document.createElement('div');
  container.id = params.containerId;
  container.style.display = 'block';
  container.style.opacity = '1';
  document.body.append(container);

  const ifr = newIframe(params);
  const shadowRoot = container.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(ifr);

  setupCloseHandler(params);
  setupUpdateHandler(params);

  return container;
}

function setupUpdateHandler(params: IframeParams): void {
  if (!params.updateHandler) return;

  window.addEventListener('message', function (event) {
    if (event.data === `rolod0x-update-${params.id}`) {
      params.updateHandler();
    }
  });
  console.debug('rolod0x: setupUpdateHandler on', params.containerId);
}

function setupCloseHandler(params: IframeParams): void {
  window.addEventListener('message', function (event) {
    if (
      // FIXME: Does this break other browsers?  Also, could we discover
      // the full origin to check against?
      // event.origin.startsWith('chrome-extension://') &&
      event.data === `rolod0x-close-${params.id}`
    ) {
      if (params.closeAction === 'hide') {
        setIframeVisibility(params.containerId, false);
        window.focus();
        document.body.focus();
      } else {
        const container = document.getElementById(params.containerId);
        if (container) {
          const parent = container.parentNode;
          parent.removeChild(container);
        } else {
          console.warn(`rolod0x: Couldn't find container with id ${params.containerId} to close`);
        }
      }
    }
  });
  console.debug('rolod0x: setupCloseHandler on', params.containerId);
}

function newIframe(params: IframeParams): HTMLIFrameElement {
  const frontEndURL = chrome.runtime.getURL(params.url);
  const ifr: HTMLIFrameElement = document.createElement('iframe');
  ifr.setAttribute('src', frontEndURL);
  ifr.setAttribute('allow', 'clipboard-write');
  ifr.setAttribute('allowtransparency', 'true');
  ifr.setAttribute('frameborder', '0');
  ifr.setAttribute('scrolling', 'no');
  // ifr.setAttribute('class', '...');
  ifr.setAttribute('title', params.title);
  ifr.style.position = 'fixed';
  ifr.style.width = params.width;
  ifr.style.height = params.height;
  ifr.style.left = '50vw';
  ifr.style.top = '50vh';
  ifr.style.transform = 'translate(-50%, -50%)';
  ifr.style.zIndex = '2147483647';
  return ifr;
}

function setIframeVisibility(containerId: string, visible: boolean): void {
  const container: HTMLElement = document.getElementById(containerId);
  if (!container) {
    console.error(`BUG: rolod0x couldn't find shadow container with id ${containerId}`);
    return;
  }
  const ifr = container.shadowRoot.firstChild as HTMLIFrameElement;
  ifr.style.display = visible ? 'block' : 'none';
  // FIXME: need to wait here until iframe is visible before focusing!
  console.log('rolod0x: Changing display of iframe to', ifr.style.display);
  // ifr.style.zIndex = String(2147483647 * (visible ? 1 : -1));
  if (visible) {
    ifr.contentWindow.postMessage('focus-input', '*');
  }
}
