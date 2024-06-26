// It seems this file cannot contain static import statements. See:
//
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/306
//
// Also, use of const or class at the top-level will result in:
//
//   Uncaught SyntaxError: Identifier '_MyClass' has already been declared
//
// So until we can import and use nice ESM syntax, we have to use normal functions
// and can't move them to another file for reusability.  Ugh.

rolod0x_iframe_init({
  id: 'lookup',
  url: 'src/pages/lookup/ui/index.html',
  title: 'rolod0x address lookup',
  width: '80%',
  height: '80%',
  closeAction: 'hide',
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! FIXME: The below code is duplicated with src/pages/content/contextMenu.ts
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
