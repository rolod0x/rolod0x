import { isContentScriptRegistered } from 'webext-dynamic-content-scripts/utils.js';
import { queryAdditionalPermissions, normalizeManifestPermissions } from 'webext-permissions';

export async function checkPermissions(reason: string): Promise<void> {
  console.log('reason: ', reason);
  const manifest = chrome.runtime.getManifest();
  console.log('manifest: ', manifest);
  const matches = [
    ...manifest.content_scripts[0].matches,
    'https://developer.chrome.com/foo',
    'https://etherscan.io/foo',
  ];
  //console.log('manifest.content_scripts: ', matches);
  for (const match of matches) {
    const mode = await isContentScriptRegistered(match);
    console.log(`${match}: ${mode}`);
  }

  // Returns mix of manifest and new, as explained in
  // https://github.com/fregante/webext-permissions
  // const perms = await chrome.permissions.getAll();
  // console.log('perms: ', perms);

  const newPermissions = await queryAdditionalPermissions();
  console.log('newPermissions.origins: ', newPermissions.origins);

  const normalizedManifestPermissions = await normalizeManifestPermissions();
  console.log('normalizedManifestPermissions.origins: ', normalizedManifestPermissions.origins);
}
