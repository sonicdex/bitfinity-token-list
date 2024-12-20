import { TokenList } from '@src/types';
import { promises as fs } from 'fs';
import { minVersionBump } from './min-version-bump';
import { nextVersion } from './next-version';
import { isVersionUpdate } from './is-version-update';

const updateVersionOnMerge = async () => {
  const baseTokenListPath = './src/base-token-list.json';
  const updatedTokenListPath = './src/token-list.json';

  try {
    const baseTokenJson: TokenList = JSON.parse(
      await fs.readFile(baseTokenListPath, 'utf8')
    );
    const updatedTokenJson: TokenList = JSON.parse(
      await fs.readFile(updatedTokenListPath, 'utf8')
    );

    const baseVersion = baseTokenJson.version;

    const baseTokens = baseTokenJson.tokens;
    const updatedTokens = updatedTokenJson.tokens;

    const versionUpgrade = minVersionBump(baseTokens, updatedTokens);
    const newVersion = nextVersion(baseVersion, versionUpgrade);

    console.log(`[INFO] Base version: ${baseVersion}`);
    console.log(`[INFO] Calculated version upgrade: ${versionUpgrade}`);
    console.log(`[INFO] New version: ${newVersion}`);

    if (isVersionUpdate(baseVersion, newVersion)) {
      // updated
      const tokenListWithNewVersion: TokenList = {
        ...updatedTokenJson,
        version: newVersion,
      };
      await fs.writeFile(
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
