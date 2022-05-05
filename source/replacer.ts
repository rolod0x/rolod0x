import {LabelMap} from './types.ts';

function isInputNode(node: Node): boolean {
    if (! node.parentNode) {
        return false;
    }
    if (node.parentNode.nodeName === 'TEXTAREA') {
        return true;
    }
    if (node.parentNode.getAttribute('contenteditable')) {
        return true;
    }

    return false;
}

/**
 * Performs substitutions in text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the substitution is done inline.
 */
export function replaceText(node: Node, labelMap: LabelMap): void {
    // Setting textContent on a node removes all of its children and replaces
    // them with a single text node. Since we don't want to alter the DOM aside
    // from substituting text, we only substitute on single text nodes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    if (node.nodeType === Node.TEXT_NODE) {
        // This node only contains text.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

        // Skip textarea nodes due to the potential for accidental submission
        // of substituted emoji where none was intended.
        if (isInputNode(node)) {
            // console.debug('skipping input node', node);
            return;
        }

        // Because DOM manipulation is slow, we don't want to keep setting
        // textContent after every replacement. Instead, manipulate a copy of
        // this string outside of the DOM and then perform the manipulation
        // once, at the end.
        let content = node.textContent;
        if (!content) {
            // console.debug('no content under', node.parentNode);
            return;
        }

        if (labelMap[content]) {
            // console.debug('replacing', node, 'containing textContent', content, 'with', labelMap[content].label);
            node.textContent = labelMap[content].label;
        }
    } else {
        // This node contains more than just text, call replaceText() on each
        // of its children.
        for (const child of node.childNodes) {
            if (child) {
                replaceText(child, labelMap);
            }
        }
    }
}

// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
export function startObserver(node: Node, labelMap: LabelMap) {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // This DOM change was new nodes being added. Run our substitution
                // algorithm on each newly added node.
                for (const newNode of mutation.addedNodes) {
                    if (newNode) {
                        replaceText(newNode, labelMap);
                    }
                }
            }
        }
    });

    observer.observe(node, {
        childList: true,
        subtree: true,
    });
}
