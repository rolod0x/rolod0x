import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';

import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import themeStorage from '@src/shared/storages/themeStorage';
import ErrorPage from '@src/components/ErrorPage';
import withSuspense from '@src/shared/hoc/withSuspense';

const SidePanel = () => {
  const theme = useStorage(themeStorage);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/sidepanel/SidePanel.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === 'light' && '#0281dc', marginBottom: '10px' }}>
          Learn React!
        </a>
        <button
          style={{
            backgroundColor: theme === 'light' ? '#fff' : '#000',
            color: theme === 'light' ? '#000' : '#fff',
          }}
          onClick={themeStorage.toggle}>
          Toggle theme
        </button>
      </header>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(SidePanel, <h1> Loading rolod0x side panel... </h1>),
  {
    fallbackRender: ({ error }) => <ErrorPage error={error} />,
  },
);
