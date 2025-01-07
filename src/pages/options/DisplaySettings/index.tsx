import { Fragment, useCallback, useEffect, useState } from 'react';
// import { styled } from '@mui/material/styles';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Box, Stack, TextField, Typography } from '@mui/material';

import { usePageTitle } from '@root/src/shared/contexts/PageTitleContext';
import { Formatter } from '@src/shared/formatter';
import { optionsStorage } from '@src/shared/options-storage';
import Rolod0xText from '@src/components/Rolod0xText';

// import SettingsPageHeader from './shared/SettingsPageHeader';
import SettingsSection from '../shared/SettingsSection';
import StyledCode from '../shared/StyledCode';

const StyledTextField = styled(TextField)(`
  margin: 16px;

  .MuiOutlinedInput-input {
    font-size: 120%;
  }
`);

const preview = css`
  .MuiFilledInput-input {
    width: 500px;
  }
`;

interface Formats {
  exact?: string;
  guess?: string;
}
const FORMAT_TYPE_TO_STORAGE: Record<keyof Formats, string> = {
  exact: 'displayLabelFormat',
  guess: 'displayGuessFormat',
};

export default function DisplaySettings() {
  const [formats, setFormats] = useState<Formats>({});
  const [previews, setPreviews] = useState<Formats>({});
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('display settings');
  }, [setPageTitle]);

  const updateLabelDisplay = useCallback(
    (formatType: keyof Formats, newFormat: string) => {
      const formatter = new Formatter(newFormat);
      const preview = formatter.format(
        'my address label',
        '0xe3D82337F79306712477b642EF59B75dD62eF109',
      );
      setFormats(oldFormats => ({ ...oldFormats, [formatType]: newFormat }));
      setPreviews(oldPreviews => ({ ...oldPreviews, [formatType]: preview }));
    },
    [setFormats, setPreviews],
  );

  const handleFormatChange = useCallback(
    async (formatType: keyof Formats, newFormat: string) => {
      updateLabelDisplay(formatType, newFormat);
      const storageKey = FORMAT_TYPE_TO_STORAGE[formatType];
      await optionsStorage.set({ [storageKey]: newFormat });
    },
    [updateLabelDisplay],
  );

  useEffect(() => {
    async function hydrateOptions() {
      const options = await optionsStorage.getAllDeserialized();
      if (options.displayLabelFormat) {
        updateLabelDisplay('exact', options.displayLabelFormat);
      }
      if (options.displayGuessFormat) {
        updateLabelDisplay('guess', options.displayGuessFormat);
      }
    }
    hydrateOptions();
  }, [updateLabelDisplay]);

  return (
    <Fragment>
      {/* <SettingsPageHeader title="Display settings" /> */}

      <SettingsSection title="Label display format for exact address matches">
        <Stack direction="row">
          <StyledTextField
            required
            variant="outlined"
            label="Label display format"
            value={formats.exact || ''}
            onChange={event => handleFormatChange('exact', event.target.value)}
          />
          <StyledTextField
            variant="filled"
            label="Label preview"
            value={previews.exact || ''}
            className={preview}
            InputProps={{
              readOnly: true,
            }}
          />
        </Stack>
        <Typography paragraph>
          When <Rolod0xText /> detects an exact match for an address in your address book, it will
          replace this with the corresponding label. Here you can configure the display format for
          these labels.
        </Typography>
        <Typography paragraph>
          The following special codes which will be substituted if used in the format string:
        </Typography>
        <ul>
          <li>
            <StyledCode>%n</StyledCode> will be substituted for the label.
          </li>
          <li>
            <StyledCode>%Nl</StyledCode> will be substituted for the left-most{' '}
            <StyledCode>N</StyledCode> digits of the address, e.g. <StyledCode>%4l</StyledCode>{' '}
            would be substituted for something like <StyledCode>e3D8</StyledCode>.
          </li>
          <li>
            <StyledCode>%Nr</StyledCode> will be substituted for the right-most{' '}
            <StyledCode>N</StyledCode> digits of the address.
          </li>
        </ul>
      </SettingsSection>

      <SettingsSection title="Label display format for abbreviated address matches">
        <Stack direction="row">
          <StyledTextField
            required
            variant="outlined"
            label="Guess display format"
            value={formats.guess || ''}
            onChange={event => handleFormatChange('guess', event.target.value)}
          />
          <StyledTextField
            variant="filled"
            label="Guess label preview"
            value={previews.guess || ''}
            className={preview}
            InputProps={{
              readOnly: true,
            }}
          />
        </Stack>
        <Typography paragraph>
          When <Rolod0xText /> detects an <em>abbreviated</em> address, it will try to guess what
          the address corresponds to. For example, if your address book has an entry for
        </Typography>
        <Box p={2}>
          <StyledCode>0x186bA87Ee6C3B4B25318c0f521C45b482d7f2dC3</StyledCode>
        </Box>
        <Typography paragraph>
          then if <Rolod0xText /> detects a string like <StyledCode>0x186b...2dC3</StyledCode> or{' '}
          <StyledCode>0x186bA87...2d7f2dC3</StyledCode> on the web page, due to the very low
          probability of the web page referring to a different address, it will guess that it's
          referring to the entry in your address book.
        </Typography>
        <Typography paragraph>
          However, for security reasons, in order to avoid the risk of this guess being wrong and
          misleading, it's strongly recommended to choose a format for these guesses which is
          different to the format for exact matches above, to make it clear that it's only a guess.
        </Typography>
        <Typography paragraph>
          The same special substitution codes described above are also available here.
        </Typography>
      </SettingsSection>
    </Fragment>
  );
}
