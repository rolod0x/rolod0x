import { v4 as uuidv4 } from 'uuid';
import OptionsSync from 'webext-options-sync';

export interface Rolod0xOptionsV1 {
  themeName: 'light' | 'dark';
  labels: string;
  displayLabelFormat: string;
  displayGuessFormat: string;
}

export interface Rolod0xAddressBookSection {
  id: string;
  title: string;
  format: 'rolod0x';
  source: 'text';
  labels: string;
}

export type Rolod0xOptionsDeserialized = Omit<Rolod0xOptionsV1, 'labels'> & {
  sections: Rolod0xAddressBookSection[];
};

export type Rolod0xOptionsSerialized = Omit<Rolod0xOptionsDeserialized, 'sections'> & {
  sections: string;
};

type Rolod0xRawOptions = Rolod0xOptionsV1 | Rolod0xOptionsSerialized;

export const serializeOptions = (options: Rolod0xOptionsDeserialized): Rolod0xOptionsSerialized => {
  const { sections, ...rest } = options;
  return {
    ...rest,
    sections: JSON.stringify(sections),
  };
};

export const deserializeOptions = (
  options: Rolod0xOptionsSerialized,
): Rolod0xOptionsDeserialized => {
  const { sections, ...rest } = options;
  return {
    ...rest,
    sections: JSON.parse(sections),
  };
};

export const labelsToSection = (labels: string): Rolod0xAddressBookSection => {
  return {
    id: uuidv4(),
    title: 'Personal addressbook',
    format: 'rolod0x',
    source: 'text',
    labels,
  };
};

export const DEFAULT_OPTIONS_DESERIALIZED: Rolod0xOptionsDeserialized = {
  themeName: 'light',
  sections: [labelsToSection('')],
  displayLabelFormat: '%n (0x%4l…%4r)',
  displayGuessFormat: '? %n ? (0x%4l…%4r)',
};

export const DEFAULT_OPTIONS_SERIALIZED: Rolod0xOptionsSerialized = serializeOptions(
  DEFAULT_OPTIONS_DESERIALIZED,
);

const mutateV1ToV2 = (options: Rolod0xOptionsV1): void => {
  (options as unknown as Rolod0xOptionsSerialized).sections = JSON.stringify([
    labelsToSection(options.labels || ''),
  ]);
  delete options.labels;
};

export const migrateToSections = (
  options: Rolod0xRawOptions,
  _currentDefaults: Rolod0xOptionsSerialized,
) => {
  console.log('Checking migration to sections');
  // Check if sections exist and are valid JSON
  if ('sections' in options) {
    console.log('ℹ️ Already migrated old labels to section');
    return;
  }

  // We must still have v1 options
  console.log('🚧 Migrating old labels to default section; before:', options);
  try {
    mutateV1ToV2(options);
    console.log('✅ Migrated old labels to default section; after:', options);
  } catch (error) {
    console.error('❌ Error during migration, resetting to defaults:', error);
  }
};

export class DeserializableOptionsSync extends OptionsSync<Rolod0xOptionsSerialized> {
  async getAllDeserialized(): Promise<Rolod0xOptionsDeserialized> {
    const serialized = await this.getAll();
    return deserializeOptions(serialized);
  }

  async setDeserialized(newOptions: Partial<Rolod0xOptionsDeserialized>): Promise<void> {
    const { sections, ...rest } = newOptions;
    const serialized: Partial<Rolod0xOptionsSerialized> = {
      ...rest,
      ...(sections && { sections: JSON.stringify(sections) }),
    };
    return super.set(serialized);
  }

  async getSection(sectionId?: string): Promise<Rolod0xAddressBookSection> {
    const options = await this.getAllDeserialized();
    // FIXME: remove this once we have support for multiple sections
    if (!sectionId) {
      return options.sections[0];
    }
    return options.sections?.find(section => section.id === sectionId);
  }

  async setSection(
    sectionId: string,
    updatedSection: Partial<Rolod0xAddressBookSection>,
  ): Promise<void> {
    const options = await this.getAllDeserialized();
    const sectionIndex = options.sections?.findIndex(section => section.id === sectionId);

    if (sectionIndex === undefined || sectionIndex === -1 || !options.sections) {
      throw new Error(`Section with id ${sectionId} not found`);
    }

    options.sections[sectionIndex] = {
      ...options.sections[sectionIndex],
      ...updatedSection,
    };

    return this.setDeserialized({ sections: options.sections });
  }

  async resetToDefaults(): Promise<Rolod0xOptionsSerialized> {
    await this.setAll(DEFAULT_OPTIONS_SERIALIZED);
    return await this.getAll();
  }

  // Override base class method to maintain type compatibility
  async set(newOptions: Partial<Rolod0xOptionsSerialized>): Promise<void> {
    return super.set(newOptions);
  }
}

export const optionsStorage = new DeserializableOptionsSync({
  defaults: DEFAULT_OPTIONS_SERIALIZED,
  migrations: [OptionsSync.migrations.removeUnused, migrateToSections],
  logging: true,
  storageType: 'local',
});

export default optionsStorage;
