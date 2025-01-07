//// This import should act in lieu of a header
////
////   <script src="http://localhost:8097"></script>
////
//// according to
////
////   https://github.com/facebook/react/blob/main/packages/react-devtools/README.md#usage-with-react-dom
////
//// but for some reason it doesn't work:
//
// import 'react-devtools';
//
//// Standalone devtools does successfully communicate over ws://localhost:8097
//// but it gets stuck at the "Loading React Element Tree" screen.
////
//// It might be due to the way rollup+vite order the compilation.
//// dist/src/pages/options/index.js shows the React DOM stuff appearing
//// before the devtools code, and this is explicitly prohibited by
//// the above link.
////
//// So instead unfortunately we have to include the <script> element
//// to get devtools working.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import '@src/shared/fonts';
import Options from '@pages/options/Options';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/options');

const router = createHashRouter([
  {
    path: '*',
    element: <Options />,
  },
]);

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

init();
