import { RefObject } from 'react';

// Ugly hack to work around the fact that useEffect can get run before refs get populated.
// FIXME: Perhaps using querySelector as per below is a better approach?
export function delayedFocusInput(ref: RefObject<HTMLInputElement>, delay = 300): void {
  setTimeout(() => focusInput(ref), delay);
}

export function focusInput(ref: RefObject<HTMLInputElement>): void {
  const input = ref.current;
  if (!input) return; // It might not be rendered yet.
  // console.debug('rolod0x: focusInput() called on:', input);
  input.focus();
  input.click();
  input.focus();

  // const input = input.querySelector('#action-bar');
  // if (!input) {
  //   console.warn("rolod0x: Couldn't find #action-bar input to focus");
  //   return;
  // }
  // input.focus();
  // console.debug('focused', input);
}
