import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { themes, ThemeName } from '@src/shared/theme';
import { optionsStorage } from '@src/shared/options-storage';

export const ThemeNameContext = createContext({
  themeName: 'light',
  toggleTheme: () => {},
  hydrateTheme: () => {},
});

interface Props {
  children: ReactNode;
  initialTheme?: ThemeName;
}

export default function Rolod0xThemeProvider({ children, initialTheme = null }: Props) {
  const [themeName, setThemeName] = useState<ThemeName | null>(initialTheme);

  const saveTheme = useCallback(async (newThemeName: ThemeName) => {
    await optionsStorage.set({ themeName: newThemeName });
  }, []);

  const hydrateTheme = useCallback(async () => {
    const options = await optionsStorage.getAllDeserialized();
    setThemeName(options.themeName);
  }, [setThemeName]);

  const toggleTheme = useCallback(() => {
    setThemeName(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      saveTheme(newMode);
      return newMode;
    });
  }, [saveTheme]);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  return (
    themeName && (
      <ThemeNameContext.Provider value={{ themeName, toggleTheme, hydrateTheme }}>
        <ThemeProvider theme={themes[themeName]}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </ThemeNameContext.Provider>
    )
  );
}
