import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import dedent from 'dedent';

import { Formatter } from '@src/shared/formatter';
import { Mapper } from '@src/shared/mapper';
import { Parser } from '@src/shared/parser';
import * as mockBrowser from '@src/shared/__mocks__/browser';

import { parentAddress, replaceInNodeAndCount } from './replacer';

describe('parentAddress', () => {
  function getTextNode(html: string): Node {
    document.body.innerHTML = html;
    const parent = screen.queryByTestId('parent');
    return parent.childNodes[0];
  }

  it('returns null if <div>', () => {
    const node = getTextNode(`<div data-testid="parent">text in node</div>`);
    expect(parentAddress(node)).toBe(null);
  });

  it('returns null if <span> without data-highlight-target attribute', () => {
    const node = getTextNode(`<div data-testid="parent">text in node</div>`);
    expect(parentAddress(node)).toBe(null);
  });

  it('returns null if <a> with no href', () => {
    const node = getTextNode(`<a data-testid="parent">text in node</div>`);
    expect(parentAddress(node)).toBe(null);
  });

  it("returns null if <a> href doesn't have an address", () => {
    const node = getTextNode(`<a data-testid="parent" href="https://foo.com">text in node</div>`);
    expect(parentAddress(node)).toBe(null);
  });

  it('returns the address if <a> href has one', () => {
    const node = getTextNode(
      `<a data-testid="parent" href="https://foo.com/address/0xe3D82337F79306712477b642EF59B75dD62eF109">text in node</div>`,
    );
    expect(parentAddress(node)).toBe('0xe3D82337F79306712477b642EF59B75dD62eF109');
  });

  it('returns the address if <span> data-highlight-target has one', () => {
    const node = getTextNode(
      `<span data-testid="parent" data-highlight-target="https://foo.com/address/0xe3D82337F79306712477b642EF59B75dD62eF109">text in node</div>`,
    );
    expect(parentAddress(node)).toBe('0xe3D82337F79306712477b642EF59B75dD62eF109');
  });
});

describe('replacer', () => {
  // Second one has ERC-55 form 0x1803982898d6A8E832177FCA8FD763B9060c3B5d
  const parser = new Parser(dedent`
    0xe3D82337F79306712477b642EF59B75dD62eF109 my label       // ERC-55
    0x1803982898d6a8e832177fca8fd763b9060c3b5d another label  // all lowercase
  `);
  const exact = new Formatter('%n | %4r');
  const guess = new Formatter('?%n? %4r');

  const runReplacement = (html: string): number => {
    const mapper = new Mapper(exact, guess);
    mapper.importParsed(parser.parsedEntries);

    document.body.innerHTML = html;
    const count = replaceInNodeAndCount(document.body, mapper.labelMap);
    return count;
  };

  const TEST_ID = 'test-id';
  const span = (content: string): string => `<span data-testid="${TEST_ID}">${content}</span>`;
  const link = (hrefAddress: string, content: string): string =>
    `<a href="https://etherscan.io/address/${hrefAddress}" data-testid="${TEST_ID}">${content}</a>`;

  const expectReplacement = (
    html: string,
    originalContent: string,
    expectedContent: string,
  ): void => {
    const count = runReplacement(html);
    const element = screen.queryByTestId(TEST_ID);
    expect(element).toHaveTextContent(expectedContent);
    expect(element).toHaveAttribute('data-rolod0x-original', originalContent);
    expect(count).toEqual(1);
  };

  const expectNoReplacement = (html: string): void => {
    const count = runReplacement(html);
    expect(document.body.innerHTML).toEqual(html);
    expect(count).toEqual(0);
  };

  const expectSpanReplacement = (content: string, expectedContent: string): void => {
    expectReplacement(span(content), content, expectedContent);
  };

  const expectLinkReplacement = (
    hrefAddress: string,
    linkText: string,
    expectedContent: string,
  ): void => {
    expectReplacement(link(hrefAddress, linkText), linkText, expectedContent);
  };

  const expectNoSpanReplacement = (content: string): void => {
    expectNoReplacement(span(content));
  };

  const expectNoLinkReplacement = (hrefAddress: string, linkText: string): void => {
    expectNoReplacement(link(hrefAddress, linkText));
  };

  it("doesn't replace an unknown ERC55 address", () => {
    expectNoSpanReplacement('0xcD3bcaeF142Ea13dFbE659B07FD24d660bF82700');
  });

  it("doesn't replace an unknown lowercase address", () => {
    expectNoSpanReplacement('0xcd3bcaef142ea13dfbe659b07fd24d660bf82700');
  });

  it("doesn't replace a non-hex address", () => {
    expectNoSpanReplacement('0xzZZbcaef142ea13dfbe659b07fd24d660bf82700');
  });

  it("doesn't replace a too short address-like hex string", () => {
    // Missing initial 0
    expectNoSpanReplacement('xe3D82337F79306712477b642EF59B75dD62eF109');
  });

  it("doesn't replace a too short address-like hex string", () => {
    // Missing a nibble near the middle
    expectNoSpanReplacement('0xe3D82337F79306712477b64EF59B75dD62eF109');
  });

  it("doesn't replace a too long address-like hex string", () => {
    // Extra nibble at the end
    expectNoSpanReplacement('0xe3D82337F79306712477b642EF59B75dD62eF1093');
  });

  it('replaces a full ERC55 address', () => {
    expectSpanReplacement('0xe3D82337F79306712477b642EF59B75dD62eF109', 'my label | F109');
  });

  it('replaces a full double-quoted ERC55 address', () => {
    expectSpanReplacement('"0xe3D82337F79306712477b642EF59B75dD62eF109"', '"my label | F109"');
  });

  it('replaces a full lowercase address', () => {
    expectSpanReplacement('0x1803982898d6a8e832177fca8fd763b9060c3b5d', 'another label | 3B5d');
  });

  it('replaces ERC55 abbreviation with a guess', () => {
    expectSpanReplacement('0xe3D8...F109', '?my label? F109');
  });

  it('replaces lowercase abbreviation with a guess', () => {
    expectSpanReplacement('0x1803...3b5d', '?another label? 3B5d');
  });

  it('replaces ERC55 abbreviation linked to known ERC55 address with exact match', () => {
    expectLinkReplacement(
      '0xe3D82337F79306712477b642EF59B75dD62eF109',
      '0xe3D8...F109',
      'my label | F109',
    );
  });

  it('replaces lowercase abbreviation linked to known lowercase address with exact match', () => {
    expectLinkReplacement(
      '0x1803982898d6a8e832177fca8fd763b9060c3b5d',
      '0x1803...3b5d',
      'another label | 3B5d',
    );
  });

  it('replaces lowercase abbreviation linked to known ERC55 address with exact match', () => {
    expectLinkReplacement(
      '0xe3D82337F79306712477b642EF59B75dD62eF109',
      '0xe3d8...f109',
      'my label | F109',
    );
  });

  it('replaces ERC55 abbreviation linked to known lowercase address with exact match', () => {
    expectLinkReplacement(
      '0x1803982898d6a8e832177fca8fd763b9060c3b5d',
      '0x1803...3B5d',
      'another label | 3B5d',
    );
  });

  it("doesn't replace ERC55 abbreviation linked to unknown ERC55 address", () => {
    expectNoLinkReplacement('0xE3d800000000000000000000000000000000F109', '0xE3d8...F109');
  });

  it("doesn't replace lowercase abbreviation linked to unknown ERC55 address", () => {
    expectNoLinkReplacement('0xE3d800000000000000000000000000000000F109', '0xe3d8...f109');
  });

  it("doesn't replace abbreviations linked to valid addresses when case mismatches", () => {
    expectNoLinkReplacement('0xE3d800000000000000000000000000000000F109', '0xe3D8...F109');
  });

  it("doesn't replace abbreviations linked to invalid addresses", () => {
    expectNoLinkReplacement('0xe3D800000000000000000000000000000000F109', '0xe3d8...f109');
  });

  const HTML_ORIG = dedent`
    <div id="foo">
      <span>0xe3D82337F79306712477b642EF59B75dD62eF109</span>
      <span>0x1803982898d6a8e832177fca8fd763b9060c3b5d</span>
      <span>0x0000000000000000000000000000000000000000</span>

      <span>0xe3D8...F109</span>
      <span>0x1803...3b5d</span>
      <span>0x0000...0000</span>

      <a href="https://etherscan.io/address/0xe3D82337F79306712477b642EF59B75dD62eF109">0xe3d8...f109</a>
      <a href="https://etherscan.io/address/0xE3d800000000000000000000000000000000F109">0xe3d8...f109</a>
    </div>
  `;

  const HTML_REPLACEMENT_1 = dedent`
    <div id="foo">
      <span data-rolod0x-original="0xe3D82337F79306712477b642EF59B75dD62eF109">my label | F109</span>
      <span data-rolod0x-original="0x1803982898d6a8e832177fca8fd763b9060c3b5d">another label | 3B5d</span>
      <span>0x0000000000000000000000000000000000000000</span>

      <span data-rolod0x-original="0xe3D8...F109">?my label? F109</span>
      <span data-rolod0x-original="0x1803...3b5d">?another label? 3B5d</span>
      <span>0x0000...0000</span>

      <a href="https://etherscan.io/address/0xe3D82337F79306712477b642EF59B75dD62eF109" data-rolod0x-original="0xe3d8...f109">my label | F109</a>
      <a href="https://etherscan.io/address/0xE3d800000000000000000000000000000000F109">0xe3d8...f109</a>
    </div>
  `;
  const EXPECTED_REPLACEMENTS = 5;

  let count: number;
  let messages;

  describe('with multiple addresses', () => {
    beforeAll(() => {
      // We don't actually need to give the mock an implementation,
      // but if we did, here's how it can be done:
      //
      // const mockSendMessage = ({ text, count }: { text: string; count: number }) => {
      //   console.log('mockSendMessage', text, count);
      // };
      // mockBrowser.runtime.sendMessage.mockImplementation(mockSendMessage);

      // Mocks seem to get automatically cleared after a test reads
      // their status, but not at the beginning of every test.
      // Since we want to capture the mock state at the end of the
      // beforeAll() for examination in subtests, we need to
      // manually clear it first, and then capture in a lexical
      // variable.
      const sendMessage = mockBrowser.runtime.sendMessage;
      sendMessage.mockClear();

      count = runReplacement(HTML_ORIG);
      messages = sendMessage.mock.calls;
    });

    it('does the right replacements', () => {
      expect(document.body.innerHTML).toEqual(HTML_REPLACEMENT_1);
    });

    it('sets badge text', () => {
      expect(messages).toEqual([[{ text: 'setBadgeText', count: EXPECTED_REPLACEMENTS }]]);
    });

    it('returns correct count', () => {
      expect(count).toEqual(EXPECTED_REPLACEMENTS);
    });
  });

  describe('with multiple addresses, some already replaced', () => {
    const HTML_REPLACEMENT_2 = HTML_REPLACEMENT_1.replace(
      '<div id="foo">',
      dedent`
        <div id="foo">
          <span>0xe3D823...D62eF109</span>
      `,
    );
    const HTML_REPLACEMENT_3 = HTML_REPLACEMENT_1.replace(
      '<div id="foo">',
      dedent`
        <div id="foo">
          <span data-rolod0x-original="0xe3D823...D62eF109">?my label? F109</span>
      `,
    );

    beforeAll(() => {
      // manually clear it first, and then capture in a lexical
      // variable.
      const sendMessage = mockBrowser.runtime.sendMessage;
      sendMessage.mockClear();

      count = runReplacement(HTML_REPLACEMENT_2);
      messages = sendMessage.mock.calls;
    });

    it('does the right replacements', () => {
      expect(document.body.innerHTML).toEqual(HTML_REPLACEMENT_3);
    });

    it('sets badge text', () => {
      expect(messages).toEqual([[{ text: 'setBadgeText', count: EXPECTED_REPLACEMENTS + 1 }]]);
    });

    it('returns correct count', () => {
      expect(count).toEqual(EXPECTED_REPLACEMENTS + 1);
    });
  });
});
