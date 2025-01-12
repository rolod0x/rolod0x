// Extend console with llog/ldebug/lerror that only log in live
// environments, i.e. outside of vitest.  This is useful for
// quietening console messages which are useful when running
// the extension but just get in the way during testing.  It's
// easier than having to mock console methods in every test
// where these messages would be emitted.

// Extend Console interface via declaration merging
declare global {
  interface Console {
    llog(message?: unknown, ...optionalParams: unknown[]): void;
    ldebug(message?: unknown, ...optionalParams: unknown[]): void;
    lerror(message?: unknown, ...optionalParams: unknown[]): void;
  }
}

console.llog = (...args: Parameters<typeof console.log>) => {
  if (typeof process === 'undefined' || !process.env.VITEST) {
    console.log(...args);
  }
};

console.ldebug = (...args: Parameters<typeof console.debug>) => {
  if (typeof process === 'undefined' || !process.env.VITEST) {
    console.debug(...args);
  }
};

console.lerror = (...args: Parameters<typeof console.error>) => {
  if (typeof process === 'undefined' || !process.env.VITEST) {
    console.error(...args);
  }
};

// Make this a module
export {};
