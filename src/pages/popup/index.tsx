import React from 'react';
import { createRoot } from 'react-dom/client';

import '@src/shared/fonts';
import Rolod0xThemeProvider from '@src/components/Rolod0xThemeProvider';
import '@pages/popup/index.css';
import Popup from '@pages/popup/Popup';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/popup');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <Rolod0xThemeProvider>
      <Popup />
    </Rolod0xThemeProvider>,
  );
}

init();
