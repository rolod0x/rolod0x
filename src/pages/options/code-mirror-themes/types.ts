import type { Extension } from '@codemirror/state';

interface ThemeExtras {
  selectionForeground: string;
}

export interface ExtensionWithExtras {
  extension: Extension;
  extras: ThemeExtras;
}
