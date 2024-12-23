import { TokenInfo, TokenList } from '@src/types';
import fs, { promises as readfs } from 'fs';
import path from 'path';
import { minVersionBump } from './min-version-bump';
import { nextVersion } from './next-version';
import { isVersionUpdate } from './is-version-update';

const parseTokens = (): TokenInfo[] => {
  const tokensDir = './src/tokens';
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

const updateVersionOnMerge = async () => {
  const baseTokenListPath = './src/base-token-list.json';
  const updatedTokenListPath = './src/token-list.json';

  try {
    const baseTokenJson: TokenList = JSON.parse(
      await readfs.readFile(baseTokenListPath, 'utf8')
    );
    const updatedTokens: TokenInfo[] = parseTokens();

    const baseVersion = baseTokenJson.version;

    const baseTokens = baseTokenJson.tokens;

    const versionUpgrade = minVersionBump(baseTokens, updatedTokens);
    const newVersion = nextVersion(baseVersion, versionUpgrade);

    console.log(`[INFO] Base version: ${baseVersion}`);
    console.log(`[INFO] Calculated version upgrade: ${versionUpgrade}`);
    console.log(`[INFO] New version: ${newVersion}`);

    if (isVersionUpdate(baseVersion, newVersion)) {
      // updated
      const tokenListWithNewVersion: TokenList = {
        ...baseTokenJson,
        timestamp: new Date().toISOString(),
        tokens: updatedTokens,
        version: newVersion,
      };
      await readfs.writeFile(
        updatedTokenListPath,
        JSON.stringify(tokenListWithNewVersion, null, 2) + '\n'
      );
    } else {
      console.log(`[WARN] No version updates`);
    }
  } catch (error) {
    console.error('[ERROR] Error upgrading version:', error);
    process.exit(1);
  }
};

(async () => {
  await updateVersionOnMerge();
})();
