import { chrome } from 'vitest-chrome';
import '../src/shared/console';

// Mock the browser globally to keep webextension-polyfill happy
// global.chrome = global.browser = chrome;
Object.assign(global, { chrome, browser: chrome });
// Object.assign(global, { chrome: mockBrowser, browser: mockBrowser });

// Make vitest-chrome play nice with webextension-polyfill
// https://github.com/extend-chrome/jest-chrome/issues/7
// chrome.runtime.sendMessage.mockImplementation(() => {
//   return Promise.resolve();
// });

// Ensure chrome.runtime.id from vitest-chrome is a string
// https://github.com/extend-chrome/jest-chrome/issues/8
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(chrome.runtime as any).id = 'fake-runtime-id';

// Workaround for jsdom not mocking Range.getClientRects()
// https://github.com/jsdom/jsdom/issues/3729
function getBoundingClientRect(): DOMRect {
  const rec = {
    x: 0,
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  };
  return { ...rec, toJSON: () => rec };
}

class FakeDOMRectList extends Array<DOMRect> implements DOMRectList {
  item(index: number): DOMRect | null {
    return this[index];
  }
}

document.elementFromPoint = (): null => null;
HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;
HTMLElement.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();
Range.prototype.getBoundingClientRect = getBoundingClientRect;
Range.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList();
