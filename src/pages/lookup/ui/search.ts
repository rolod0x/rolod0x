import { ParsedEntries } from '@src/shared/types';

export function itemsFilter(items: ParsedEntries, { inputValue }) {
  const lowerCasedWords = inputValue.toLowerCase().match(/\S+/g);

  // Show all items if no search terms provided
  if (!lowerCasedWords) return items;

  // Require each search term to match a substring of either the label or the address.
  return items.filter(item =>
    lowerCasedWords.every(
      (word: string) =>
        item.label.toLowerCase().includes(word) || item.address.toLowerCase().includes(word),
    ),
  );
}
