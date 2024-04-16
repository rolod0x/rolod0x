export function displayLookup(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['src/pages/lookup/index.js'],
  });
}
