import * as browser from 'webextension-polyfill';

import { isAbbreviation } from '@src/shared/abbreviators';
import { RE_ADDRESS_FORMATS } from '@src/shared/regexps';
import { LabelComment, LabelMap } from '@src/shared/types';

type ReplacementData = [textToLookup: string, before: string, data: LabelComment, after: string];

const ORIGINAL_ATTRIBUTE = 'data-rolod0x-original';

function getAddressFromAttribute(
  element: HTMLElement,
  tagName: string,
  attributeName: string,
): string | null {
  if (!element) return null;
  if (element.tagName !== tagName) return null;

  const value = element.getAttribute(attributeName);
  if (!value) return null;

  const m = value.match(RE_ADDRESS_FORMATS);
  return m ? m[0] : null;
}

export function parentAddress(node: Node): string | null {
  const parent = node.parentElement;

  return (
    getAddressFromAttribute(parent, 'A', 'href') ||
    getAddressFromAttribute(parent, 'SPAN', 'data-highlight-target')
  );
}

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
  if (node.nodeType === Node.TEXT_NODE) {
    // This node only contains text.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.
    return replaceOnTextNode(node, labelMap);
  }

  // This node contains more than just text, call replaceInNode() on each
  // of its children.
  let count = 0;
  for (const child of node.childNodes) {
    if (child) {
      count += replaceInNode(child, labelMap);
    }
  }
  return count;
}

function textNodeIsIgnored(node: Node): boolean {
  // Skip textarea nodes due to the potential for accidental submission
  // of substitutions where none was intended.
  if (isInputNode(node)) {
    // console.debug('skipping input node', node);
    return true;
  }

  // Because DOM manipulation is slow, we don't want to keep setting
  // textContent after every replacement. Instead, manipulate a copy of
  // this string outside of the DOM and then perform the manipulation
  // once, at the end.
  if (!node.textContent) {
    // console.debug('no content under', node.parentNode);
    return true;
  }

  return false;
}

/*
 * Get the text within the text node which needs looking up in the address
 * book and potentially replacing, as well as any text before and after
 * which should be left unchanged.
 *
 * @param  {Node} node - The target DOM Node.
 * @return {[before, textToLookup, after] | null}
 */
export function getLookupText(
  node: Node,
): [before: string, textToLookup: string, after: string] | null {
  const content = node.textContent;
  const match = content.match(/^(?<before>\s*)(?<body>.+?)(?<after>\s*?)$/);
  if (!match) {
    return null;
  }
  return [match.groups.before, match.groups.body, match.groups.after];
}

/*
 * Get the text within the text node which needs looking up in the address
 * book, do the lookup, and return the result, as well as any text before
 * and after which should be left unchanged.  Returns null if no
 * replacement is needed.
 *
 * @param  {Node} node - The target DOM Node.
 * @return {[toLookup, before, replacementData, after] | null}
 */
export function getTextNodeReplacementData(node: Node, labelMap: LabelMap): ReplacementData | null {
  const toLookup = getLookupText(node);
  if (!toLookup) return null;
  const [before, textToLookup, after] = toLookup;

  const data = labelMap.get(textToLookup);
  if (!data) return null;
  return [textToLookup, before, data, after];
}

// Check whether the text node or its parent (if an <a href="...">) has
// a full address.  If they both do, ensure that they match otherwise
// warn the user that something fishy is probably going on.
//
// If a full address is found which matches an entry in the address
// book, perform the replacement based on that.  Otherwise if a partial
// address is found which matches, replace based on that instead.
export function replaceOnTextNode(node: Node, labelMap: LabelMap): number {
  if (textNodeIsIgnored(node)) return 0;

  const replacement = getTextNodeReplacementData(node, labelMap);
  if (!replacement) return 0; // nothing to replace

  const [textToLookup, before, data, after] = replacement;

  const hrefAddr = parentAddress(node);
  if (!hrefAddr) {
    return replaceText(node, data.label, before, after);
  }

  if (!isAbbreviation(textToLookup.toLowerCase(), hrefAddr.toLowerCase())) {
    // They didn't match, so just ignore the href address
    return replaceText(node, data.label, before, after);
  }

  // They match, so if the link address has a label, replace with that
  // rather than the text node.
  const linkData = labelMap.get(hrefAddr);
  if (linkData) {
    return replaceText(node, linkData.label, before, after);
  }
  return 0;
}

function replaceText(node: Node, label: string, before, after): 0 | 1 {
  const replacement = before + label + after;
  const original = node.textContent;
  // console.debug('replacing', node, 'containing textContent', original, 'with', replacement);
  const alreadyReplaced = !!node.parentElement.getAttribute(ORIGINAL_ATTRIBUTE);
  node.parentElement.setAttribute(ORIGINAL_ATTRIBUTE, original);
  node.textContent = replacement;
  return alreadyReplaced ? 0 : 1;
}

function countReplacements(): number {
  return document.querySelectorAll('[data-rolod0x-original]').length;
}

function updateBadge(): number {
  const count = countReplacements();
  // Make sure we have a valid runtime, since hot reloads seem to interfere with this.
  // See https://stackoverflow.com/a/69603416/179332
  if (browser.runtime?.id) {
    browser.runtime.sendMessage({ text: 'setBadgeText', count });
  }
  return count;
}

export function replaceInNodeAndCount(node: Node, labelMap: LabelMap): number {
  // console.time('rolod0x: initial replacement');
  replaceInNode(node, labelMap);
  const count = updateBadge();
  // console.debug('initial replacements: ', count);
  // console.timeEnd('rolod0x: initial replacement');
  return count;
}

// Now monitor the DOM for additions and substitute labels into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
export function startObserver(node: Node, labelMap: LabelMap): void {
  const observer = new MutationObserver(mutations => {
    // console.time("rolod0x: observer");
    for (const mutation of mutations) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // This DOM change was new nodes being added. Run our substitution
        // algorithm on each newly added node.
        for (const newNode of mutation.addedNodes) {
          if (newNode) {
            replaceInNode(newNode, labelMap);
          }
        }
      }
    }

    updateBadge();
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
  // browser.runtime.connect().onDisconnect.addListener(function () {
  //   console.log('rolod0x: disconnecting observer', observer);
  //   observer.disconnect();
  // });
}
