import OptionsSync from 'webext-options-sync';

import type { Options } from 'webext-options-sync';

export interface Rolod0xOptions extends Options {
  themeName: 'light' | 'dark';
  labels: string;
  displayLabelFormat: string;
  displayGuessFormat: string;
}

export const DEFAULT_OPTIONS: Rolod0xOptions = {
  themeName: 'light',
  labels: '',
  displayLabelFormat: '%n (0x%4l…%4r)',
  displayGuessFormat: '[0x%4l…%n?…%4r]',
};

export const optionsStorage = new OptionsSync<Rolod0xOptions>({
  defaults: DEFAULT_OPTIONS,
  migrations: [OptionsSync.migrations.removeUnused],
  logging: true,
  storageType: 'local',
});

export default optionsStorage;
