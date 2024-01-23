// It seems this file cannot contain static import statements.
// See:
//
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
// - https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/306

function init(): void {
  const shadowContainer = document.createElement('div');
  shadowContainer.id = 'chrome-extension-boilerplate-react-vite-lookup-view-root';
  shadowContainer.style.display = 'block';
  shadowContainer.style.opacity = '1';

  document.body.append(shadowContainer);

  const frontEndURL = chrome.runtime.getURL('src/pages/lookup/ui/index.html');
  const ifr = document.createElement('iframe');
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

  const shadowRoot = shadowContainer.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(ifr);

  console.log('rolod0x: lookup loaded');
}

void init();
