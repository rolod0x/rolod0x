// This doesn't work for the same reason documented in
// src/pages/options/index.tsx:
//
// import 'react-devtools';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@src/shared/fonts';
import UpdateAddressBook from '@pages/content/contextMenu/UpdateAddressBook';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/contextMenu');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(
    <StrictMode>
      <UpdateAddressBook />
    </StrictMode>,
  );
}

init();
