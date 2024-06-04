import dedent from 'dedent';

import {
  mockGetAll,
  mockSet,
  mockSetAll,
  resetOptionsMocks,
} from '@root/test-utils/mocks/options-storage';

import {
  optionsStorage,
  labelsToSection,
  Rolod0xAddressBookSection,
  serializeOptions,
  Rolod0xOptionsSerialized,
  Rolod0xOptionsDeserialized,
  DEFAULT_OPTIONS_SERIALIZED,
  migrateToSections,
  Rolod0xOptionsV1,
} from './options-storage';

describe('options-storage', () => {
  beforeEach(() => {
    resetOptionsMocks();
  });

  describe('serializeOptions()', () => {
    it('serializes options', () => {
      const deserialized: Rolod0xOptionsDeserialized = {
        themeName: 'light',
        sections: [
          {
            id: '47b70315-d782-4080-afc1-6c47d0e89dfb',
            title: 'Personal addressbook',
            format: 'rolod0x',
            source: 'text',
            labels: dedent`
              0xe3D82337F79306712477b642EF59B75dD62eF109 my address`,
          },
        ],
        displayLabelFormat: '%n (0x%4l…%4r)',
        displayGuessFormat: '? %n ? (0x%4l…%4r)',
      };
      const serialized: Rolod0xOptionsSerialized = serializeOptions(deserialized);
      const expected = {
        themeName: 'light',
        sections: `[{"id":"47b70315-d782-4080-afc1-6c47d0e89dfb","title":"Personal addressbook","format":"rolod0x","source":"text","labels":"0xe3D82337F79306712477b642EF59B75dD62eF109 my address"}]`,
        displayLabelFormat: '%n (0x%4l…%4r)',
        displayGuessFormat: '? %n ? (0x%4l…%4r)',
      };
      expect(serialized).toEqual(expected);
    });
  });

  describe('labelsToSection()', () => {
    let section: Rolod0xAddressBookSection;

    beforeAll(() => {
      // For some stupendously weird reason, this causes Jest
      // to fail to parse the file:
      //
      //   const section = labelsToSection('0xe3D82337F79306712477b642EF59B75dD62eF109 my address');
      //
      // Whereas this is fine:
      //
      //   const section = { id: 'laksdflkaskdlfkasjfd' };
      //
      // This alone forced a switch to vitest, which was horrendous to
      // attempt, but much more pleasant than jest once managed.
      section = labelsToSection('0xe3D82337F79306712477b642EF59B75dD62eF109 my address\n');
    });

    it('generates a uuid', () => {
      expect(section.id.length).toEqual(36);
    });

    it('sets a default title', () => {
      expect(section.title).toEqual('Personal addressbook');
    });

    it('sets a default source', () => {
      expect(section.source).toEqual('text');
    });

    it('sets a default format', () => {
      expect(section.format).toEqual('rolod0x');
    });
  });

  describe('migrateToSections', () => {
    it('migrates v1 options with labels to sections format', () => {
      const v1Options: Rolod0xOptionsV1 = {
        themeName: 'light',
        labels: '0xD3159eC8ABb2114812E65A87a5c28DA3841C7FD7 my address',
        displayLabelFormat: '%n (0x%4l…%4r)',
        displayGuessFormat: '? %n ? (0x%4l…%4r)',
      };

      // Create a copy to avoid modifying the original
      const optionsToMigrate = { ...v1Options } as unknown as Rolod0xOptionsSerialized;
      migrateToSections(optionsToMigrate, DEFAULT_OPTIONS_SERIALIZED);

      expect(optionsToMigrate).not.toHaveProperty('labels');
      expect(optionsToMigrate).toHaveProperty('sections');

      const sections = JSON.parse(optionsToMigrate.sections);
      expect(sections).toHaveLength(1);
      expect(sections[0]).toMatchObject({
        title: 'Personal addressbook',
        format: 'rolod0x',
        source: 'text',
        labels: v1Options.labels,
      });
      expect(sections[0].id).toHaveLength(36); // UUID length
    });

    it('handles empty labels during migration', () => {
      const v1Options: Rolod0xOptionsV1 = {
        themeName: 'light',
        labels: '',
        displayLabelFormat: '%n (0x%4l…%4r)',
        displayGuessFormat: '? %n ? (0x%4l…%4r)',
      };

      const optionsToMigrate = { ...v1Options } as unknown as Rolod0xOptionsSerialized;
      migrateToSections(optionsToMigrate, DEFAULT_OPTIONS_SERIALIZED);

      const sections = JSON.parse(optionsToMigrate.sections);
      expect(sections[0].labels).toBe('');
    });

    it('skips migration if sections already exist', () => {
      const existingOptions: Rolod0xOptionsSerialized = {
        themeName: 'light',
        sections: JSON.stringify([
          {
            id: 'test-id',
            title: 'Existing Section',
            format: 'rolod0x',
            source: 'text',
            labels: 'existing labels',
          },
        ]),
        displayLabelFormat: '%n (0x%4l…%4r)',
        displayGuessFormat: '? %n ? (0x%4l…%4r)',
      };

      const optionsToMigrate = { ...existingOptions };
      migrateToSections(optionsToMigrate, DEFAULT_OPTIONS_SERIALIZED);

      expect(optionsToMigrate.sections).toBe(existingOptions.sections);
    });
  });

  describe('DeserializableOptionsSync', () => {
    beforeEach(() => {
      mockGetAll.mockClear();
      mockSet.mockClear();
      mockGetAll.mockResolvedValue(DEFAULT_OPTIONS_SERIALIZED);
      mockSet.mockResolvedValue(undefined);
    });

    it('correctly serializes sections when setting options', async () => {
      const newOptions: Partial<Rolod0xOptionsDeserialized> = {
        themeName: 'dark',
        sections: [
          {
            id: '47b70315-d782-4080-afc1-6c47d0e89dfb',
            title: 'Test Section',
            format: 'rolod0x',
            source: 'text',
            labels: '0xe3D82337F79306712477b642EF59B75dD62eF109 test address',
          },
        ],
      };

      await optionsStorage.setDeserialized(newOptions);

      expect(mockSet).toHaveBeenCalledWith({
        themeName: 'dark',
        sections: JSON.stringify(newOptions.sections),
      });
    });

    it('handles partial updates without sections', async () => {
      const newOptions: Partial<Rolod0xOptionsDeserialized> = {
        themeName: 'dark',
        displayLabelFormat: '%n (%h)',
      };

      await optionsStorage.setDeserialized(newOptions);

      expect(mockSet).toHaveBeenCalledWith({
        themeName: 'dark',
        displayLabelFormat: '%n (%h)',
      });
    });

    describe('setSection', () => {
      const existingSection = {
        id: '47b70315-d782-4080-afc1-6c47d0e89dfb',
        title: 'Test Section',
        format: 'rolod0x' as const,
        source: 'text' as const,
        labels: 'original labels',
      };

      beforeEach(() => {
        mockGetAll.mockResolvedValue({
          ...DEFAULT_OPTIONS_SERIALIZED,
          sections: JSON.stringify([existingSection]),
        });
      });

      it('updates an existing section', async () => {
        const updatedSection = {
          title: 'Updated Title',
          labels: 'updated labels',
        };

        await optionsStorage.setSection(existingSection.id, updatedSection);

        expect(mockSet).toHaveBeenCalledWith({
          sections: JSON.stringify([
            {
              ...existingSection,
              ...updatedSection,
            },
          ]),
        });
      });

      it('throws error when section not found', async () => {
        const nonExistentId = 'non-existent-id';
        await expect(
          optionsStorage.setSection(nonExistentId, { title: 'New Title' }),
        ).rejects.toThrow(`Section with id ${nonExistentId} not found`);
      });

      it('preserves other sections when updating one', async () => {
        const secondSection = {
          id: 'second-section-id',
          title: 'Second Section',
          format: 'rolod0x' as const,
          source: 'text' as const,
          labels: 'second section labels',
        };

        mockGetAll.mockResolvedValue({
          ...DEFAULT_OPTIONS_SERIALIZED,
          sections: JSON.stringify([existingSection, secondSection]),
        });

        const updatedSection = {
          title: 'Updated First Section',
        };

        await optionsStorage.setSection(existingSection.id, updatedSection);

        expect(mockSet).toHaveBeenCalledWith({
          sections: JSON.stringify([
            {
              ...existingSection,
              ...updatedSection,
            },
            secondSection,
          ]),
        });
      });
    });

    describe('getSection()', () => {
      it('returns the first section when no sectionId is provided', async () => {
        const mockSection: Rolod0xAddressBookSection = {
          id: 'test-section',
          title: 'Test Section',
          format: 'rolod0x',
          source: 'text',
          labels: '',
        };
        mockGetAll.mockResolvedValue({
          ...DEFAULT_OPTIONS_SERIALIZED,
          sections: JSON.stringify([mockSection]),
        });

        const result = await optionsStorage.getSection();
        expect(result).toEqual(mockSection);
      });

      it('returns the matching section when sectionId is provided', async () => {
        const mockSections: Rolod0xAddressBookSection[] = [
          {
            id: 'section-1',
            title: 'Section 1',
            format: 'rolod0x',
            source: 'text',
            labels: '',
          },
          {
            id: 'section-2',
            title: 'Section 2',
            format: 'rolod0x',
            source: 'text',
            labels: '',
          },
        ];
        mockGetAll.mockResolvedValue({
          ...DEFAULT_OPTIONS_SERIALIZED,
          sections: JSON.stringify(mockSections),
        });

        const result = await optionsStorage.getSection('section-2');
        expect(result).toEqual(mockSections[1]);
      });

      it('returns undefined when sectionId is not found', async () => {
        const mockSections: Rolod0xAddressBookSection[] = [
          {
            id: 'section-1',
            title: 'Section 1',
            format: 'rolod0x',
            source: 'text',
            labels: '',
          },
        ];
        mockGetAll.mockResolvedValue({
          ...DEFAULT_OPTIONS_SERIALIZED,
          sections: JSON.stringify(mockSections),
        });

        const result = await optionsStorage.getSection('non-existent');
        expect(result).toBeUndefined();
      });
    });

    describe('resetToDefaults()', () => {
      it('resets all options to default values', async () => {
        // Setup initial non-default values
        const nonDefaultOptions: Rolod0xOptionsSerialized = {
          themeName: 'dark',
          sections: JSON.stringify([
            {
              id: 'test-section',
              title: 'Test Section',
              format: 'rolod0x',
              source: 'text',
              labels: 'some labels',
            },
          ]),
          displayLabelFormat: 'custom format',
          displayGuessFormat: 'custom guess format',
        };
        mockGetAll.mockResolvedValue(nonDefaultOptions);

        await optionsStorage.resetToDefaults();

        expect(mockSetAll).toHaveBeenCalledWith(DEFAULT_OPTIONS_SERIALIZED);
      });
    });
  });
});
