import Ajv from 'ajv';
import { promises as fs } from 'fs';
import addFormats from 'ajv-formats';
import { TokenInfo, TokenList } from '@src/types';

const schemaPath = './src/tokenlist.schema.json';
const tokenListPath = './src/token-list.json';

const validateUniqueAddresses = (tokens: TokenInfo[]) => {
  const addresses = tokens.map(token => token.address.toLowerCase());
  return new Set(addresses).size === addresses.length;
};

(async () => {
  const ajv = new Ajv();
  addFormats(ajv);

  try {
    const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
    const validate = ajv.compile(schema);
    const tokenList: TokenList = JSON.parse(
      await fs.readFile(tokenListPath, 'utf8')
    );

    const valid = validate(tokenList);
    const isUnique = validateUniqueAddresses(tokenList.tokens);
    if (!valid || !isUnique) {
      console.error(
        'Validation failed:',
        validate.errors,
        'is unique',
        isUnique
      );
      process.exit(1);
    } else {
      console.log('Validation successful!');
    }
  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
})();
