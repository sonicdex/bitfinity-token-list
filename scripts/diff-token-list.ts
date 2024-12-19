import { TokenInfo } from './types';

export type TokenInfoChangeKey = Exclude<keyof TokenInfo, 'address'>;
export type TokenInfoChanges = Array<TokenInfoChangeKey>;

/**
 * Compares two token info key values
 * @param a comparison item a
 * @param b comparison item b
 */
function compareTokenInfoProperty(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((el, i) => b[i] === el);
  }
  return false;
}

/**
 * Differences between a base list and an updated list.
 */
export interface TokenListDiff {
  /**
   * Tokens from updated with addresses not present in base list
   */
  readonly added: TokenInfo[];
  /**
   * Tokens from base with addresses not present in the updated list
   */
  readonly removed: TokenInfo[];
  /**
   * The token info that changed
   */
  readonly changed: {
    [address: string]: TokenInfoChanges;
  };
}

/**
 * Computes the diff of a token list where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export function diffTokenLists(
  base: TokenInfo[],
  update: TokenInfo[]
): TokenListDiff {
  const indexedBase = base.reduce<{ [address: string]: TokenInfo }>(
    (memo, tokenInfo) => {
      memo[tokenInfo.address] = tokenInfo;
      return memo;
    },
    {}
  );

  const newListUpdates = update.reduce<{
    added: TokenInfo[];
    changed: { [address: string]: TokenInfoChanges };
    index: { [address: string]: true };
  }>(
    (memo, tokenInfo) => {
      const baseToken = indexedBase[tokenInfo.address];
      if (!baseToken) {
        memo.added.push(tokenInfo);
      } else {
        const changes: TokenInfoChanges = Object.keys(tokenInfo)
          .filter((key): key is TokenInfoChangeKey => key !== 'address')
          .filter(key => {
            return !compareTokenInfoProperty(tokenInfo[key], baseToken[key]);
          });

        if (changes.length > 0) {
          memo.changed[tokenInfo.address] = changes;
        }
      }

      memo.index[tokenInfo.address] = true;
      return memo;
    },
    { added: [], changed: {}, index: {} }
  );

  const removed = base.filter(
    tokenInfo => !newListUpdates.index[tokenInfo.address]
  );

  return {
    added: newListUpdates.added,
    changed: newListUpdates.changed,
    removed,
  };
}
