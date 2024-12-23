import { TokenInfo, TokenList } from '@src/types';
import fs from 'fs';
import path from 'path';

const loadMainTokenList = (): TokenInfo[] => {
  const tokenListPath = path.resolve('temp', 'token-list.json');
  return (JSON.parse(fs.readFileSync(tokenListPath, 'utf-8')) as TokenList)
    .tokens;
};

const checkForDuplicates = (newToken: TokenInfo): boolean => {
  const mainTokens = loadMainTokenList();
  return mainTokens.some(token => token.address === newToken.address);
};

export { checkForDuplicates };
