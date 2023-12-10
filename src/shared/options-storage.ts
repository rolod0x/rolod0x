import type { Options } from 'webext-options-sync';
import OptionsSync from 'webext-options-sync';

export interface Rolod0xOptions extends Options {
  labels: string;
}

const defaults: Rolod0xOptions = {
  labels: '',
};

export const optionsStorage = new OptionsSync<Rolod0xOptions>({
  defaults,
  migrations: [OptionsSync.migrations.removeUnused],
  logging: true,
  storageType: 'local',
});

export default optionsStorage;
