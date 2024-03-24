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

void rolod0x_iframe_init('lookup', 'src/pages/lookup/ui/index.html', 'rolod0x address lookup');

function rolod0x_iframe_init(id: string, url: string, title: string): void {
  const containerId = `rolod0x-${id}-iframe-container`;
  if (document.getElementById(containerId)) {
    setIframeVisibility(containerId, true);
  } else {
    newContainer(id, containerId, url, title);
  }
}

function newContainer(id: string, containerId: string, url: string, title: string) {
  const container: HTMLDivElement = document.createElement('div');
  container.id = containerId;
  container.style.display = 'block';
  container.style.opacity = '1';
  document.body.append(container);

  const ifr = newIframe(url, title);
  const shadowRoot = container.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(ifr);

  setupHideHandler(id, containerId);

  return container;
}

function setupHideHandler(id: string, containerId: string) {
  window.addEventListener('message', function (event) {
    if (
      // FIXME: Does this break other browsers?  Also, could we discover
      // the full origin to check against?
      // event.origin.startsWith('chrome-extension://') &&
      event.data === `rolod0x-hide-${id}`
    ) {
      setIframeVisibility(containerId, false);
      window.focus();
      document.body.focus();
    }
  });
  console.log('setupHideHandler on', containerId);
}

function newIframe(url: string, title: string) {
  const frontEndURL = chrome.runtime.getURL(url);
  const ifr: HTMLIFrameElement = document.createElement('iframe');
  ifr.setAttribute('src', frontEndURL);
  ifr.setAttribute('allow', 'clipboard-write');
  ifr.setAttribute('allowtransparency', 'true');
  ifr.setAttribute('frameborder', '0');
  ifr.setAttribute('scrolling', 'no');
  // ifr.setAttribute('class', '...');
  ifr.setAttribute('title', title);
  ifr.style.position = 'fixed';
  ifr.style.left = '10%';
  ifr.style.top = '10%';
  ifr.style.width = '80%';
  ifr.style.height = '80%';
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
