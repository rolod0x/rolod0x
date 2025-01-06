import { useContext, useMemo } from 'react';
// darken is from:
// https://github.com/mui/material-ui/blob/48251abb01cac73ee9924feb804286f97c2e45ff/apps/zero-runtime-vite-app/src/utils/colorManipulator.js#L270
// as documented in:
// https://mui.com/material-ui/customization/palette/#provide-tokens-manually
import { css } from '@emotion/css';
import { useTheme, Theme } from '@mui/material/styles';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { ThemeNameContext } from '@src/components/Rolod0xThemeProvider';

import { cmThemeFunctions } from './code-mirror-themes';

const extensions = [javascript({ jsx: true })];

interface Props {
  value: string;
  onChange: (event) => Promise<void>;
}

export default function CodeMirrorTextAddresses(props: Props) {
  const theme: Theme = useTheme();
  const { themeName } = useContext(ThemeNameContext);
  const cmTheme = useMemo(() => {
    const themeFn = cmThemeFunctions[themeName];
    return themeFn(theme.palette);
  }, [theme, themeName]);

  // Required because react-codemirror doesn't support setting
  // foreground colour of selected text yet.  See:
  // https://github.com/uiwjs/react-codemirror/blob/e16e45adc9ef7c2237033df148ddb757fd136c0e/themes/theme/src/index.tsx#L101-L107
  const style = css`
    .cm-content ::selection {
      color: ${cmTheme.extras.selectionForeground};
    }
  `;

  const placeholder = '0x6B175474E89094C44Da98b954EedeAC495271d0F DAI    // Dai Stablecoin';

  return (
    <CodeMirror
      data-testid="codeMirror-editor"
      data-joyride-target="codeMirror-editor"
      value={props.value}
      onChange={props.onChange}
      minWidth="800px"
      minHeight="50px"
      maxHeight="800px"
      theme={cmTheme.extension}
      className={style}
      extensions={extensions}
      placeholder={placeholder}
      basicSetup={{ lineNumbers: true, autocompletion: false }}
    />
  );
}
