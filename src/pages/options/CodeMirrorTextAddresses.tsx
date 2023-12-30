import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    backgroundImage: '',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#5c6166' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});
const extensions = [javascript({ jsx: true })];

interface Props {
  value: string;
  onChange: (event) => Promise<void>;
}

export default function CodeMirrorTextAddresses(props: Props) {
  return (
    <CodeMirror
      value={props.value}
      onChange={props.onChange}
      minWidth="800px"
      minHeight="100px"
      maxHeight="800px"
      theme={myTheme}
      extensions={extensions}
      placeholder="0x6B175474E89094C44Da98b954EedeAC495271d0F DAI    // Dai Stablecoin"
      basicSetup={{ lineNumbers: true, autocompletion: false }}
    />
  );
}
