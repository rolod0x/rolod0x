import { useEffect } from 'react';

// Not used, just keeping this here in case we ever need to resurrect it.

export default function App() {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return (
    <div className="">
      Content view should not be visible; if you are seeing this, please report as a bug!
    </div>
  );
}
