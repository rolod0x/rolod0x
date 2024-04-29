import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import dedent from 'dedent';

import { Formatter } from '@src/shared/formatter';
import { Mapper } from '@src/shared/mapper';
import { Parser } from '@src/shared/parser';
import * as mockBrowser from '@src/shared/__mocks__/browser';

import { replaceInNodeAndCount } from './replacer';

describe('replacer', () => {
  let mapper: Mapper;
  const counter = { count: 0 };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockSendMessage = ({ text, count }: { text: string; count: number }) => {
      // console.log('mockSendMessage', text);
    };

    const parser = new Parser(dedent`
      0xe3D82337F79306712477b642EF59B75dD62eF109 my label       // ERC-55
      0x1803982898d6a8e832177fca8fd763b9060c3b5d another label  // all lowercase
    `);
    const exact = new Formatter('%n | %4r');
    const guess = new Formatter('?%n? %4r');
    mapper = new Mapper(exact, guess);
    mapper.importParsed(parser.parsedEntries);

    counter.count = 0;

    document.body.innerHTML = `
      <div id="foo">
        <span data-testid="full-erc55">0xe3D82337F79306712477b642EF59B75dD62eF109</span>
        <span data-testid="full-lowercase">0x1803982898d6a8e832177fca8fd763b9060c3b5d</span>
        <span data-testid="partial-erc55">0xe3D8...F109</span>
        <span data-testid="partial-lowercase">0x1803...3b5d</span>
      </div>
    `;
    mockBrowser.runtime.sendMessage.mockImplementation(mockSendMessage);
    replaceInNodeAndCount(document.body, mapper.labelMap, counter);
  });

  it('sets badge text', () => {
    const sendMessage = mockBrowser.runtime.sendMessage;
    const messages = sendMessage.mock.calls;
    expect(messages).toEqual([[{ text: 'setBadgeText', count: 4 }]]);
  });

  it('sets counter', () => {
    expect(counter.count).toEqual(4);
  });

  const expectReplacement = (id: string, content: string) => {
    expect(screen.queryByTestId(id)).toHaveTextContent(content);
  };

  it('replaces full addresses', () => {
    expectReplacement('full-erc55', 'my label | F109');
    expectReplacement('full-lowercase', 'another label | 3B5d');
  });

  it('replaces partial addresses with guesses', () => {
    expectReplacement('partial-erc55', '?my label? F109');
    expectReplacement('partial-lowercase', '?another label? 3B5d');
  });
});
