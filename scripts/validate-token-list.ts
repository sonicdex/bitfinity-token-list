import Ajv from 'ajv';
import { promises as fs } from 'fs';
import addFormats from 'ajv-formats';

const schemaPath = './src/tokenlist.schema.json';
const tokenListPath = './src/token-list.json';

(async () => {
  const ajv = new Ajv();
  addFormats(ajv);

  try {
    const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
    const validate = ajv.compile(schema);
    const tokenList = JSON.parse(await fs.readFile(tokenListPath, 'utf8'));

    const valid = validate(tokenList);

    if (!valid) {
      console.error('Validation failed:', validate.errors);
      process.exit(1);
    } else {
      console.log('Validation successful!');
    }
  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
})();
