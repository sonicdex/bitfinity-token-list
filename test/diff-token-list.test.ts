import { diffTokenLists } from '../scripts/diff-token-list';
import { TokenInfo } from '@scripts/types';

const tokenA: TokenInfo = {
  address: '0x0a',
  logoURI: 'ipfs://test',
  symbol: 'abcd',
  name: 'token a',
  decimals: 18,
};
const tokenAChangedNameDecimals: TokenInfo = {
  ...tokenA,
  name: 'blah',
  decimals: 12,
};

const tokenB: TokenInfo = {
  address: '0x0b',
  logoURI: 'ipfs://blah',
  symbol: 'defg',
  name: 'token b',
  decimals: 9,
};

describe('#diffTokenLists', () => {
  it('add new token', () => {
    expect(diffTokenLists([tokenA], [tokenA, tokenB])).toEqual({
      added: [tokenB],
      removed: [],
      changed: {},
    });
  });
  it('change address to remove', () => {
    expect(diffTokenLists([tokenA], [tokenB])).toEqual({
      added: [tokenB],
      removed: [tokenA],
      changed: {},
    });
  });

  it('change name', () => {
    expect(
      diffTokenLists([tokenB, tokenA], [tokenB, tokenAChangedNameDecimals])
    ).toEqual({
      added: [],
      changed: { '0x0a': ['name', 'decimals'] },
      removed: [],
    });
  });
});
