import { Counter, LabelMap } from '@src/shared/types';

const ORIGINAL_ATTRIBUTE = 'data-rolod0x-original';

function isInputNode(node: Node): boolean {
  if (!node.parentElement) {
    return false;
  }
  if (node.parentElement.tagName === 'TEXTAREA') {
    return true;
  }
  if (node.parentElement.getAttribute('contenteditable')) {
    return true;
  }

  return false;
}

/**
 * Performs substitutions in text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceInNode() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the substitution is done inline.
 */
export function replaceInNode(node: Node, labelMap: LabelMap): number {
  // Setting textContent on a node removes all of its children and replaces
  // them with a single text node. Since we don't want to alter the DOM aside
  // from substituting text, we only substitute on single text nodes.
  // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  let count = 0;
  if (node.nodeType === Node.TEXT_NODE) {
    // This node only contains text.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

    // Skip textarea nodes due to the potential for accidental submission
    // of substituted emoji where none was intended.
    if (isInputNode(node)) {
      // console.debug('skipping input node', node);
      return 0;
    }

    // Because DOM manipulation is slow, we don't want to keep setting
    // textContent after every replacement. Instead, manipulate a copy of
    // this string outside of the DOM and then perform the manipulation
    // once, at the end.
    const content = node.textContent;
    if (!content) {
      // console.debug('no content under', node.parentNode);
      return 0;
    }

    const match = content.match(/^(?<before>\s*)(?<body>.+?)(?<after>\s*?)$/);

    const data = labelMap.get(match ? match.groups.body : content);
    if (data) {
      count += replaceText(node, content, data.label, match?.groups.before, match?.groups.after);
    }
  } else {
    // This node contains more than just text, call replaceInNode() on each
    // of its children.
    for (const child of node.childNodes) {
      if (child) {
        count += replaceInNode(child, labelMap);
      }
    }
  }
  return count;
}

function replaceText(node: Node, original: string, label: string, before = '', after = ''): 0 | 1 {
  const replacement = before + label + after;
  // console.debug('replacing', node, 'containing textContent', original, 'with', replacement);
  const alreadyReplaced = !!node.parentElement.getAttribute(ORIGINAL_ATTRIBUTE);
  node.parentElement.setAttribute(ORIGINAL_ATTRIBUTE, original);
  node.textContent = replacement;
  return alreadyReplaced ? 0 : 1;
}

// Now monitor the DOM for additions and substitute labels into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
export function startObserver(node: Node, labelMap: LabelMap, counter: Counter): void {
  // console.debug('startObserver with count', counter.count);
  const observer = new MutationObserver(mutations => {
    // console.time("rolod0x: observer");
    for (const mutation of mutations) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // This DOM change was new nodes being added. Run our substitution
        // algorithm on each newly added node.
        for (const newNode of mutation.addedNodes) {
          if (newNode) {
            counter.count += replaceInNode(newNode, labelMap);
          }
        }
      }
    }

    // Make sure we have a valid runtime, since hot reloads seem to interfere with this.
    // See https://stackoverflow.com/a/69603416/179332
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({ text: 'setBadgeText', count: counter.count });
    }
    // console.timeEnd("rolod0x: observer");
  });

  observer.observe(node, {
    childList: true,
    subtree: true,
  });

  // This might be an alternative approach to preventing old mutation observers
  // from trying to connect to invalidated contexts; however it is supposedly a
  // bad idea in MV3; see:
  //
  //   https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte#comment133201331_55336841
  //
  // chrome.runtime.connect().onDisconnect.addListener(function () {
  //   console.log('rolod0x: disconnecting observer', observer);
  //   observer.disconnect();
  // });
}
