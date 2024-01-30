// It seems this file cannot contain static import statements.
//
// Also, use of const or class at the top-level will result in:
//
// Uncaught SyntaxError: Identifier '_MyClass' has already been declared
//
// See:
//
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/306

class ShadowContainer {
  // Wrapped in a class to avoid const redefinition warnings
  static readonly ID = 'chrome-extension-boilerplate-react-vite-lookup-view-root';
  static readonly URL = 'src/pages/lookup/ui/index.html';

  static init(): void {
    if (document.getElementById(ShadowContainer.ID)) {
      ShadowContainer.setIframeVisibility(true);
    } else {
      ShadowContainer.newContainer();
    }

    console.log('rolod0x: address lookup container loaded');
  }

  static newContainer() {
    const container: HTMLDivElement = document.createElement('div');
    container.id = ShadowContainer.ID;
    container.style.display = 'block';
    container.style.opacity = '1';
    document.body.append(container);

    const ifr = ShadowContainer.newIframe();
    const shadowRoot = container.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(ifr);

    ShadowContainer.setupHideHandler();

    return container;
  }

  static setupHideHandler() {
    window.addEventListener('message', function (event) {
      if (
        // FIXME: Does this break other browsers?  Also, could we discover
        // the full origin to check against?
        // event.origin.startsWith('chrome-extension://') &&
        event.data === 'rolod0x-hide-lookup'
      ) {
        ShadowContainer.setIframeVisibility(false);
      }
    });
    console.log('setupHideHandler');
  }

  static newIframe() {
    const frontEndURL = chrome.runtime.getURL(ShadowContainer.URL);
    const ifr: HTMLIFrameElement = document.createElement('iframe');
    ifr.setAttribute('src', frontEndURL);
    ifr.setAttribute('allowtransparency', 'true');
    ifr.setAttribute('frameborder', '0');
    ifr.setAttribute('scrolling', 'no');
    // ifr.setAttribute('class', '...');
    ifr.setAttribute('title', 'rolod0x address lookup');
    ifr.style.position = 'fixed';
    ifr.style.left = '10%';
    ifr.style.top = '10%';
    ifr.style.width = '80%';
    ifr.style.height = '80%';
    ifr.style.zIndex = '2147483647';
    return ifr;
  }

  static setIframeVisibility(visible: boolean): void {
    const container: HTMLElement = document.getElementById(ShadowContainer.ID);
    if (!container) {
      console.error(
        `BUG: rolod0x couldn't find lookup shadow container with id ${ShadowContainer.ID}`,
      );
      return;
    }
    const ifr = container.shadowRoot.firstChild as HTMLIFrameElement;
    ifr.style.display = visible ? 'block' : 'none';
    // ifr.style.zIndex = String(2147483647 * (visible ? 1 : -1));
  }
}

void ShadowContainer.init();
