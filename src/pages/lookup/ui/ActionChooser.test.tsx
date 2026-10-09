import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { mockGetAll, resetOptionsMocks } from '@test-utils/mocks/options-storage';
import { DEFAULT_OPTIONS_SERIALIZED } from '@src/shared/options-storage';

import ActionChooser from './ActionChooser';

const EVM_ADDRESS = '0xe3D82337F79306712477b642EF59B75dD62eF109';
const SOLANA_ADDRESS = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';

const COMMON_ACTIONS = ['Copy address to clipboard', 'Search via DuckDuckGo', 'Search via Google'];

const renderActionChooser = async (address: string): Promise<void> => {
  await act(async () => {
    render(<ActionChooser selectedItem={{ address, label: 'my label' }} onClose={vi.fn()} />);
  });
};

// The action list opens once the input has been focused
const getActionLabels = async (): Promise<string[]> => {
  const listbox = await screen.findByRole('listbox', {}, { timeout: 2000 });
  return within(listbox)
    .getAllByRole('option')
    .map(option => option.textContent);
};

describe('ActionChooser', () => {
  beforeEach(() => {
    resetOptionsMocks();
    mockGetAll.mockResolvedValue(DEFAULT_OPTIONS_SERIALIZED);
  });

  it('offers EVM block explorers for an EVM address', async () => {
    await renderActionChooser(EVM_ADDRESS);

    expect(await getActionLabels()).toEqual([
      ...COMMON_ACTIONS,
      'View on blockscan.com',
      'View on etherscan.io',
      'View on sepolia.etherscan.io',
      'View on basescan.org',
      'View on sepolia.basescan.org',
      'View on arbiscan.io',
      'View on sepolia.arbiscan.io',
      'View on optimistic.etherscan.io',
      'View on sepolia.optimistic.etherscan.io',
      'View on optimistic.blockscout.com',
      'View on sepolia.optimistic.blockscout.com',
      'View on explorer.zksync.io',
      'View on sepolia.explorer.zksync.io',
      'View on polygonscan.com',
      'View on amoy.polygonscan.com',
      'View on celoscan.io',
      'View on explorer.celo.org',
      'View on alfajores.celoscan.io',
      'View on explorer.celo.org/alfajores',
      'View on OpenSea',
    ]);
  });

  it('offers Solana block explorers for a Solana address', async () => {
    await renderActionChooser(SOLANA_ADDRESS);

    expect(await getActionLabels()).toEqual([
      ...COMMON_ACTIONS,
      'View on solscan.io',
      'View on explorer.solana.com',
      'View on solana.fm',
      'View on orbmarkets.io',
      'View on OpenSea',
    ]);
  });

  it.each([
    ['View on solscan.io', `https://solscan.io/account/${SOLANA_ADDRESS}`],
    ['View on explorer.solana.com', `https://explorer.solana.com/address/${SOLANA_ADDRESS}`],
    ['View on solana.fm', `https://solana.fm/address/${SOLANA_ADDRESS}`],
    ['View on orbmarkets.io', `https://orbmarkets.io/address/${SOLANA_ADDRESS}`],
  ])('%s opens the Solana address on that explorer', async (action, url) => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderActionChooser(SOLANA_ADDRESS);
    await getActionLabels();

    await userEvent.click(screen.getByRole('option', { name: action }));

    expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
    expect(log).toHaveBeenCalledWith(`rolod0x: Opening ${url} from my label`);
    open.mockRestore();
    log.mockRestore();
  });
});
