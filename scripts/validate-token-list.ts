import fs from 'fs';
import { promises as readfs } from 'fs';

import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { TokenInfo, TokenList } from '@src/types';

const tokenListPath = './src/token-list.json';
const schemaPath = './src/tokenlist.schema.json';

const tokensDir = './src/tokens';

const ajv = new Ajv();
addFormats(ajv);

const parseTokens = (): TokenInfo[] => {
  const tokenList: TokenInfo[] = [];

  const tokenFolders = fs.readdirSync(tokensDir);

  tokenFolders.forEach(folder => {
    const metadataPath = path.join(tokensDir, folder, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      tokenList.push(metadata);
    }
  });

  return tokenList;
};

const validateList = async (tokens: TokenInfo[]) => {
  const tokenList: TokenList = JSON.parse(
    await readfs.readFile(tokenListPath, 'utf8')
  );

  const tokenListWithUpdated = {
    ...tokenList,
    tokens,
  };

  const schema = JSON.parse(await readfs.readFile(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);
  const valid = validate(tokenListWithUpdated);
  console.log(`[INFO] IsValid: ${valid}. \n Errors : `);
  console.log(validate.errors);
  return valid;
};

const checkForDuplicates = (tokenList: TokenInfo[]): boolean => {
  const seenAddresses: Set<string> = new Set();

  for (const token of tokenList) {
    if (seenAddresses.has(token.address)) {
      return true;
    }
    seenAddresses.add(token.address);
  }

  return false;
};

const validateTokens = async () => {
  const currentTokenList = parseTokens();
  const isValid = await validateList(currentTokenList);
  if (!isValid) process.exit(1);

  const hasDuplicates = checkForDuplicates(currentTokenList);

  if (hasDuplicates) {
    console.log('There are duplicate tokens in the list.');
    process.exit(1);
  } else {
    console.log('No duplicates found.');
  }
};

validateTokens();
