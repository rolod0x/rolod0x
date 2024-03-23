import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { themes, ThemeName } from '@src/shared/theme';
import { optionsStorage, Rolod0xOptions } from '@src/shared/options-storage';

export const ThemeNameContext = createContext({ themeName: 'light', toggleTheme: () => {} });

interface Props {
  children: ReactNode;
}

export default function Rolod0xThemeProvider({ children }: Props) {
  const [themeName, setThemeName] = useState<ThemeName | null>(null);

  const saveTheme = useCallback(async (newThemeName: ThemeName) => {
    await optionsStorage.set({ themeName: newThemeName });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      saveTheme(newMode);
      return newMode;
    });
  }, [saveTheme, setThemeName]);

  useEffect(() => {
    async function _getTheme() {
      const options: Rolod0xOptions = await optionsStorage.getAll();
      setThemeName(options.themeName);
    }
    _getTheme();
  }, [setThemeName]);

  return (
    themeName && (
      <ThemeNameContext.Provider value={{ themeName, toggleTheme }}>
        <ThemeProvider theme={themes[themeName]}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </ThemeNameContext.Provider>
    )
  );
}
