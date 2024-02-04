interface Error {
  message: string;
  stack: string;
}

export default function ErrorPage({ error }: { error: Error }) {
  // FIXME: include error
  console.error('got error', error);
  return (
    <div id="error" style={{ margin: '0 auto', maxWidth: '1000px' }}>
      <h1>Error!</h1>
      <p>Oops, sorry! Unfortunately, an error occurred in rolod0x:</p>
      <div style={{ border: 'solid 1px red', padding: '16px ' }}>
        <pre>{error.stack}</pre>
      </div>
      <p>
        Please{' '}
        <a href="https://github.com/aspiers/rolod0x/issues/new?labels=bug&projects=&template=bug_report.md">
          report this bug
        </a>{' '}
        so we can fix it. Thanks a lot!
      </p>
    </div>
  );
}
