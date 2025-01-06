import { alpha, darken, Palette } from '@mui/material/styles';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import type { CreateThemeOptions } from '@uiw/codemirror-themes';
import type { ExtensionWithExtras } from './types';

export function darkTheme(palette: Palette): ExtensionWithExtras {
  // Taken from abcdef theme
  // https://uiwjs.github.io/react-codemirror/#/theme/data/abcdef
  // https://github.com/uiwjs/react-codemirror/blob/master/themes/abcdef/src/index.ts
  const settings: CreateThemeOptions['settings'] = {
    background: palette.background.default, // was '#0f0f0f'
    foreground: palette.primary.main, // was '#defdef'
    caret: palette.text.primary, // was '#00FF00'
    selection: palette.secondary.main,
    selectionMatch: palette.secondary.dark,
    gutterBackground: '#555',
    gutterForeground: palette.text.primary, // was '#FFFFFF'
    lineHighlight: alpha(darken(palette.info.dark, 0.6), 0.5), // was '#0a6bcb3d'
  };

  const extension = createTheme({
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

  return { extension, extras: { selectionForeground: palette.background.default } };
}
