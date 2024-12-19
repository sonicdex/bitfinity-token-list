import { minVersionBump, TokenInfo, VersionUpgrade } from '../scripts/index';
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
describe('#minVersionBump', () => {
  it('empty', () => {
    expect(minVersionBump([], [])).toBe(VersionUpgrade.NONE);
  });
  it('patch for name/decimals changes', () => {
    expect(minVersionBump([tokenA], [tokenAChangedNameDecimals])).toBe(
      VersionUpgrade.PATCH
    );
  });
  it('major for remove', () => {
    expect(minVersionBump([tokenA], [])).toBe(VersionUpgrade.MAJOR);
  });
  it('minor for add', () => {
    expect(minVersionBump([], [tokenA])).toBe(VersionUpgrade.MINOR);
  });
  it('major for add/remove', () => {
    expect(minVersionBump([tokenB], [tokenA])).toBe(VersionUpgrade.MAJOR);
  });
});
