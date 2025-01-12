import { v4 as uuidv4 } from 'uuid';
import OptionsSync from 'webext-options-sync';
import { z } from 'zod';

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
  url: string | null;
  expanded: boolean;
}

export type Rolod0xOptionsDeserialized = Omit<Rolod0xOptionsV1, 'labels'> & {
  sections: Rolod0xAddressBookSection[];
  hasSeenTour: boolean;
};

// Zod schemas that match our TypeScript types
export const rolod0xAddressBookSectionSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1),
    format: z.literal('rolod0x'),
    source: z.literal('text'),
    labels: z.string(),
    url: z.string().nullable(),
    expanded: z.boolean(),
  })
  .strict();

export const rolod0xOptionsDeserializedSchema = z
  .object({
    themeName: z.enum(['light', 'dark']),
    sections: z.array(rolod0xAddressBookSectionSchema).nonempty(),
    displayLabelFormat: z.string().min(1),
    displayGuessFormat: z.string().min(1),
    hasSeenTour: z.boolean(),
  })
  .strict() as z.ZodType<Rolod0xOptionsDeserialized>;

export const validateDeserialized = (
  options: unknown,
): z.SafeParseReturnType<Rolod0xOptionsDeserialized, Rolod0xOptionsDeserialized> => {
  return rolod0xOptionsDeserializedSchema.safeParse(options);
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
  try {
    return {
      ...rest,
      sections: JSON.parse(sections),
    };
  } catch (error) {
    console.error('Failed to parse sections JSON:', error);
    console.error('Full options JSON was:', options);
    return {
      ...rest,
      sections: DEFAULT_OPTIONS_DESERIALIZED.sections,
    };
  }
};

export const labelsToSection = (labels: string): Rolod0xAddressBookSection => {
  return {
    id: uuidv4(),
    title: 'Personal address book',
    format: 'rolod0x',
    source: 'text',
    labels,
    url: null,
    expanded: true,
  };
};

export const DEFAULT_OPTIONS_DESERIALIZED: Rolod0xOptionsDeserialized = {
  themeName: 'light',
  sections: [labelsToSection('')],
  displayLabelFormat: '%n (0x%4l…%4r)',
  displayGuessFormat: '? %n ? (0x%4l…%4r)',
  hasSeenTour: false,
};

export const DEFAULT_OPTIONS_SERIALIZED: Rolod0xOptionsSerialized = serializeOptions(
  DEFAULT_OPTIONS_DESERIALIZED,
);

const mutateV1ToV2 = (options: Rolod0xOptionsV1): Rolod0xOptionsSerialized => {
  (options as unknown as Rolod0xOptionsSerialized).sections = JSON.stringify([
    labelsToSection(options.labels || ''),
  ]);
  delete options.labels;
  return options as unknown as Rolod0xOptionsSerialized;
};

export const migrateToSections = (
  options: Rolod0xRawOptions,
  _currentDefaults: Rolod0xOptionsSerialized,
) => {
  console.llog('Checking migration to sections');
  // Check if sections exist and are valid JSON
  if ('sections' in options) {
    console.llog('ℹ️ Already migrated old labels to section');
    return;
  }

  // We must still have v1 options
  console.llog('🚧 Migrating old labels to default section; before:', options);
  try {
    mutateV1ToV2(options);
    console.llog('✅ Migrated old labels to default section; after:', options);
  } catch (error) {
    console.error('❌ Error during migration, resetting to defaults:', error);
  }
};

const isV1Options = (options: Rolod0xRawOptions): options is Rolod0xOptionsV1 => {
  return 'labels' in options;
};

export class DeserializableOptionsSync extends OptionsSync<Rolod0xOptionsSerialized> {
  async getAllDeserialized(): Promise<Rolod0xOptionsDeserialized> {
    const raw = await this.getAll();
    const v2 = isV1Options(raw) ? mutateV1ToV2(raw) : raw;
    return deserializeOptions(v2);
  }

  async setDeserialized(newOptions: Partial<Rolod0xOptionsDeserialized>): Promise<void> {
    const { sections, ...rest } = newOptions;
    const serialized: Partial<Rolod0xOptionsSerialized> = {
      ...rest,
      ...(sections && { sections: JSON.stringify(sections) }),
    };
    return super.set(serialized);
  }

  async setAllDeserialized(newOptions: Rolod0xOptionsDeserialized): Promise<void> {
    return super.setAll(serializeOptions(newOptions));
  }

  async getSection(sectionId: string): Promise<Rolod0xAddressBookSection> {
    const options = await this.getAllDeserialized();
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

  async deleteSection(sectionId: string): Promise<void> {
    const options = await this.getAllDeserialized();
    const updatedSections = options.sections.filter(section => section.id !== sectionId);

    // Ensure we always have at least one section
    if (updatedSections.length === 0) {
      updatedSections.push(labelsToSection(''));
    }

    return this.setDeserialized({ sections: updatedSections });
  }

  async resetToDefaults(): Promise<Rolod0xOptionsSerialized> {
    await this.setAll(DEFAULT_OPTIONS_SERIALIZED);
    return await this.getAll();
  }

  // FIXME: Why is this needed?  Previous comment was:
  // "Override base class method to maintain type compatibility"
  // but this isn't clear.
  // async set(newOptions: Partial<Rolod0xRawOptions>): Promise<void> {
  //   return super.set(newOptions);
  // }
}

export const optionsStorage = new DeserializableOptionsSync({
  defaults: DEFAULT_OPTIONS_SERIALIZED,
  migrations: [OptionsSync.migrations.removeUnused, migrateToSections],
  logging: true,
  storageType: 'local',
});

export default optionsStorage;
