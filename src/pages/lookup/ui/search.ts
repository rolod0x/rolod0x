import { FilterOptionsState } from '@mui/material';

import { ParsedEntries, AddressLabelComment } from '@root/src/shared/types';

// This is for use with the MUI Autocomplete component, which requires the filter
// function to be of this type: https://mui.com/material-ui/react-autocomplete/#custom-filter
export function itemsFilter<T>(
  items: T[],
  filterOptionsState: FilterOptionsState<T>,
  wordMatcher: (item: T, word: string) => boolean,
): T[] {
  const lowerCasedWords = filterOptionsState.inputValue.toLowerCase().match(/\S+/g);

  // Show all items if no search terms provided
  if (!lowerCasedWords) return items;

  // Require each search term to match according to the wordMatcher function
  return items.filter(item => lowerCasedWords.every(word => wordMatcher(item, word)));
}

function addressBookItemMatcher(item: AddressLabelComment, word: string): boolean {
  return item.label.toLowerCase().includes(word) || item.address.toLowerCase().includes(word);
}

export function addressBookItemsFilter(
  items: ParsedEntries,
  searchString: FilterOptionsState<AddressLabelComment>,
): ParsedEntries {
  return itemsFilter<AddressLabelComment>(items, searchString, addressBookItemMatcher);
}
