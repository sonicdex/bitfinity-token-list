import fs from 'fs';
import path from 'path';
import { validateMetadata } from './validate-metadata';
import { checkForDuplicates } from './check-for-duplicatets';

// Function to get all the changed token metadata files from the PR
const getChangedFiles = (gitDiffOutput: string): string[] => {
  const files = gitDiffOutput
    .split('\n')
    .filter(line => line.includes('src/tokens/'));
  return files;
};

// Function to validate each token from the PR
const validatePRTokens = (gitDiffOutput: string): void => {
  const changedFiles = getChangedFiles(gitDiffOutput);

  changedFiles.forEach(filePath => {
    const fullPath = path.resolve(filePath);
    const metadataValid = validateMetadata(fullPath);

    if (metadataValid) {
      const metadata = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

      // Check for duplicate in the main list
      const isDuplicate = checkForDuplicates(metadata);
      if (isDuplicate) {
        console.log(
          `Duplicate token found: ${metadata.symbol} (${metadata.address})`
        );
      } else {
        console.log(`Valid token: ${metadata.symbol} (${metadata.address})`);
      }
    }
  });
};

export { validatePRTokens };
