export function getBadgeText() {
  return new Promise((resolve, _reject) => {
    chrome.action.getBadgeText({}, result => {
      resolve(result);
    });
  });
}
