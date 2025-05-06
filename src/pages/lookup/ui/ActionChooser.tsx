import React, { useCallback, useEffect, useState } from 'react';
import { DialogContentText, FilterOptionsState } from '@mui/material';

import { Formatter } from '@root/src/shared/formatter';
import { AddressLabel } from '@src/shared/types';
import { optionsStorage, DEFAULT_OPTIONS_DESERIALIZED } from '@src/shared/options-storage';

import { itemsFilter } from './search';
import FocusedAutocomplete from './FocusedAutocomplete';

// Once the user has selected an address book entry, we want to offer a list
// of actions to perform on the address and/or the label:
type ActionInputs = {
  address: string;
  label: string;
};
type Action = (inputs: ActionInputs) => void;
type ActionTuple = readonly [string, Action];

export default function ActionChooser({
  selectedItem,
  onClose,
}: {
  selectedItem: AddressLabel;
  onClose: (_event: React.SyntheticEvent, reason: string) => void;
}) {
  const [displayFormat, setDisplayFormat] = useState(
    DEFAULT_OPTIONS_DESERIALIZED.displayLabelFormat,
  );

  useEffect(() => {
    const loadDisplayFormat = async () => {
      const options = await optionsStorage.getAllDeserialized();
      setDisplayFormat(options.displayLabelFormat);
    };
    loadDisplayFormat();
  }, []);

  const handleActionSelect = useCallback(
    (event: React.SyntheticEvent, actionTuple: ActionTuple | null, reason: string) => {
      if (actionTuple && selectedItem) {
        const [, action] = actionTuple;
        action({ address: selectedItem.address, label: selectedItem.label });
      }
      onClose(event, reason);
    },
    [selectedItem, onClose],
  );

  const clipboardWriteAction: Action = (inputs: ActionInputs) => {
    // This requires allow="clipboard-write" in the containing <iframe>
    window.navigator.clipboard.writeText(inputs.address);
    console.log(`rolod0x: Copied '${inputs.address}' to clipboard from ${inputs.label}`);
  };

  // A typical action is opening a URL, so we want a generalised way of generating
  // this type of action:
  type UrlActionFactory = (urlGenerator: UrlGenerator) => Action;

  // This in turn needs a way of generating the URL from the inputs:
  type UrlGenerator = (inputs: ActionInputs) => string;

  const openUrl = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const urlActionFactory: UrlActionFactory = (urlGenerator: UrlGenerator): Action => {
    return (inputs: ActionInputs) => {
      const url = urlGenerator(inputs);
      console.log(`rolod0x: Opening ${url} from ${inputs.label}`);
      openUrl(url);
    };
  };

  const googleSearchUrlGenerator: UrlGenerator = (inputs: ActionInputs) =>
    `https://www.google.co.uk/search?hl=en&q=${inputs.address}`;
  const duckduckgoSearchUrlGenerator: UrlGenerator = (inputs: ActionInputs) =>
    `https://duckduckgo.com/?q=${inputs.address}&ia=web`;
  const searchEngineActionFactory: (urlGenerator: UrlGenerator) => Action = (
    urlGenerator: UrlGenerator,
  ) => urlActionFactory(urlGenerator);

  const blockExplorerUrl = (domain: string, searchTerm: string): string =>
    `https://${domain}/search?f=0&q=${searchTerm}`;
  const blockExplorerUrlGenerator = (domain: string): UrlGenerator => {
    return (inputs: ActionInputs): string => blockExplorerUrl(domain, inputs.address);
  };
  const blockExplorerActionFactory = (domain: string): Action =>
    urlActionFactory(blockExplorerUrlGenerator(domain));

  const celoExplorerUrlGenerator = (network: string) => {
    return (inputs: ActionInputs): string =>
      `https://explorer.celo.org/${network}/address/${inputs.address}`;
  };
  const openSeaActionFactory = (): Action => {
    const openSeaUrlGenerator = (inputs: ActionInputs): string => {
      return `https://opensea.io/${inputs.address}`;
    };
    return urlActionFactory(openSeaUrlGenerator);
  };

  const actionItemMatcher = (action: ActionTuple, word: string): boolean => {
    const [label] = action;
    return label.toLowerCase().includes(word);
  };

  const actionItemFilter = (
    items: ActionTuple[],
    searchString: FilterOptionsState<ActionTuple>,
  ): ActionTuple[] => {
    return itemsFilter<ActionTuple>(items, searchString, actionItemMatcher);
  };

  const actionTuples: ActionTuple[] = [
    ['Copy address to clipboard', clipboardWriteAction],
    ['Search via DuckDuckGo', searchEngineActionFactory(duckduckgoSearchUrlGenerator)],
    ['Search via Google', searchEngineActionFactory(googleSearchUrlGenerator)],
    ['View on blockscan.com', blockExplorerActionFactory('blockscan.com')],

    ['View on etherscan.io', blockExplorerActionFactory('etherscan.io')],
    ['View on sepolia.etherscan.io', blockExplorerActionFactory('sepolia.etherscan.io')],

    ['View on basescan.org', blockExplorerActionFactory('basescan.org')],
    ['View on sepolia.basescan.org', blockExplorerActionFactory('sepolia.basescan.org')],

    ['View on arbiscan.io', blockExplorerActionFactory('arbiscan.io')],
    ['View on sepolia.arbiscan.io', blockExplorerActionFactory('sepolia.arbiscan.io')],

    ['View on optimistic.etherscan.io', blockExplorerActionFactory('optimistic.etherscan.io')],
    [
      'View on sepolia.optimistic.etherscan.io',
      blockExplorerActionFactory('sepolia.optimistic.etherscan.io'),
    ],

    ['View on optimistic.blockscout.com', blockExplorerActionFactory('optimistic.blockscout.com')],
    [
      'View on sepolia.optimistic.blockscout.com',
      blockExplorerActionFactory('sepolia.optimistic.blockscout.com'),
    ],

    ['View on explorer.zksync.io', blockExplorerActionFactory('explorer.zksync.io')],
    [
      'View on sepolia.explorer.zksync.io',
      blockExplorerActionFactory('sepolia.explorer.zksync.io'),
    ],

    ['View on polygonscan.com', blockExplorerActionFactory('polygonscan.com')],
    ['View on amoy.polygonscan.com', blockExplorerActionFactory('amoy.polygonscan.com')],

    ['View on celoscan.io', blockExplorerActionFactory('celoscan.io')],
    ['View on explorer.celo.org', urlActionFactory(celoExplorerUrlGenerator('mainnet'))],
    ['View on alfajores.celoscan.io', blockExplorerActionFactory('alfajores.celoscan.io')],
    [
      'View on explorer.celo.org/alfajores',
      urlActionFactory(celoExplorerUrlGenerator('alfajores')),
    ],
    ['View on OpenSea', openSeaActionFactory()],
  ] as const;

  const formatter = new Formatter(displayFormat);

  return (
    <>
      <DialogContentText sx={{ pb: 2 }}>
        Choose an action to perform on{' '}
        <strong>
          {formatter.format(selectedItem.label, selectedItem.address, selectedItem.addressType)}
        </strong>
        :
      </DialogContentText>
      <FocusedAutocomplete<ActionTuple, false, false, false>
        id="action-chooser"
        // This would break Escape closing the dropdown and then a second escape
        // closing the modal:
        // open={true}
        // However it _is_ useful for debugging.
        options={actionTuples}
        getOptionLabel={([label]) => label}
        getOptionKey={([label]) => label}
        label="Choose action"
        onChange={handleActionSelect}
        onClose={onClose}
        filterOptions={actionItemFilter}
        sx={{ minWidth: 500 }}
      />
    </>
  );
}
