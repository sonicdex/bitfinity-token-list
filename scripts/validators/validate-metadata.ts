import fs from 'fs';
import { validateTokenInfo } from './token-validator';

const validateMetadata = (filePath: string): boolean => {
  const metadata = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const valid = validateTokenInfo(metadata);

  if (!valid) {
    console.log(`Invalid metadata in file: ${filePath}`);
    validateTokenInfo.errors?.forEach(err => {
      console.log(`Error in property ${err.instancePath}: ${err.message}`);
    });
    return false;
  }

  return true;
};

export { validateMetadata };
