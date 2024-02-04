// This doesn't work for the same reason documented in
// src/pages/options/index.tsx:
//
// import 'react-devtools';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@src/shared/fonts';
import Lookup from '@pages/lookup/ui/Lookup';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/lookup');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(
    <StrictMode>
      <Lookup />
    </StrictMode>,
  );
}

init();
