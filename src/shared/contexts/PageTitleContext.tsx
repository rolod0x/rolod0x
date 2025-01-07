import { createContext, useContext, ReactNode, useState, ReactElement } from 'react';

interface PageTitleContextType {
  pageTitle: string | ReactElement;
  setPageTitle: (title: string | ReactElement) => void;
}

export const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: '',
  setPageTitle: () => {},
});

export const usePageTitle = () => {
  const { pageTitle, setPageTitle } = useContext(PageTitleContext);
  const setPageTitleWithDefault = (title: string | ReactElement) => {
    setPageTitle(title);
    return () => setPageTitle('settings');
  };
  return { pageTitle, setPageTitle: setPageTitleWithDefault };
};

interface PageTitleProviderProps {
  children: ReactNode;
}

export function PageTitleProvider({ children }: PageTitleProviderProps) {
  const [pageTitle, setPageTitle] = useState<string | ReactElement>('');

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
