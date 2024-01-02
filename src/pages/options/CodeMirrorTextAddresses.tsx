import { useMemo } from 'react';
// darken is from:
// https://github.com/mui/material-ui/blob/48251abb01cac73ee9924feb804286f97c2e45ff/apps/zero-runtime-vite-app/src/utils/colorManipulator.js#L270
// as documented in:
// https://mui.com/material-ui/customization/palette/#provide-tokens-manually
import { darken, useTheme } from '@mui/material/styles';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
// For some weird reason this interface needs to be imported via 'import type':
import type { CreateThemeOptions } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';

// import { themeOptions } from '../../shared/theme';

const extensions = [javascript({ jsx: true })];

interface Props {
  value: string;
  onChange: (event) => Promise<void>;
}

export default function CodeMirrorTextAddresses(props: Props) {
  const theme = useTheme();

  const palette = useMemo(() => theme.palette, [theme]);

  // Taken from abcdef theme
  // https://uiwjs.github.io/react-codemirror/#/theme/data/abcdef
  // https://github.com/uiwjs/react-codemirror/blob/master/themes/abcdef/src/index.ts
  const settings: CreateThemeOptions['settings'] = useMemo(() => {
    console.log('palette.background.default', palette.background.default);
    return {
      background: palette.background.default, // was '#0f0f0f'
      foreground: palette.primary.main, // was '#defdef'
      caret: palette.primary.main, // was '#00FF00'
      selection: '#515151', // could be something related to palette.text.secondary
      selectionMatch: '#515151',
      gutterBackground: '#555',
      gutterForeground: palette.text.primary, // was '#FFFFFF'
      lineHighlight: darken(palette.info.dark, 0.6), // was '#0a6bcb3d'
    };
  }, [palette]);

  const myTheme = useMemo(() => {
    return createTheme({
      theme: 'dark',
      settings,
      styles: [
        { tag: t.keyword, color: 'darkgoldenrod', fontWeight: 'bold' },
        { tag: t.atom, color: '#77F' },
        { tag: t.comment, color: '#7a7b7c', fontStyle: 'italic' },
        {
          tag: t.number,
          color: palette.secondary.main, // was 'violet'
        },
        { tag: t.definition(t.variableName), color: '#fffabc' },
        {
          tag: t.variableName,
          color: palette.text.primary, // was '#abcdef'
        },
        { tag: t.function(t.variableName), color: '#fffabc' },
        { tag: t.typeName, color: '#FFDD44' },
        { tag: t.tagName, color: '#def' },
        { tag: t.string, color: '#2b4' },
        { tag: t.meta, color: '#C9F' },
        // { tag: t.qualifier, color: '#FFF700' },
        // { tag: t.builtin, color: '#30aabc' },
        { tag: t.bracket, color: '#8a8a8a' },
        { tag: t.attributeName, color: '#DDFF00' },
        { tag: t.heading, color: 'aquamarine', fontWeight: 'bold' },
        { tag: t.link, color: 'blueviolet', fontWeight: 'bold' },
      ],
    });
  }, [palette, settings]);

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
