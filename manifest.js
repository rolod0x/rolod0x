import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['activeTab', 'contextMenus', 'scripting', 'sidePanel', 'storage'],
  optional_permissions: [],
  optional_host_permissions: ['*://*/*'],
  content_security_policy: {
    extension_pages: [
      // Allow react-devtools <script> tag.
      "script-src http://localhost:8097 'self'",
      "object-src 'self'",

      // Not sure if this is needed
      // "connect-src ws://localhost:8081 ws://localhost:8097 'self'",
    ].join(';'),
  },
  side_panel: {
    default_path: 'src/pages/sidepanel/index.html',
  },
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: [
        // Block explorers
        'https://*.etherscan.io/*',
        'https://blockscan.com/*',
        'https://*.polygonscan.com/*',
        'https://*.arbiscan.io/*',
        'https://*.gnosisscan.io/*',
        'https://*.explorer.zksync.io/*',
        'https://explorer.celo.org/*',
        'https://*.celoscan.io/*',
        'https://explorer.bitquery.io/*',

        // Multisig management services
        'https://app.safe.global/*',
        'https://safe.celo.org/*',

        // Developer services
        'https://bugs.immunefi.com/*',
        'https://dashboard.tenderly.co/*',
        'https://defender.openzeppelin.com/*',

        // Portfolio trackers
        'https://coinshift.xyz/*',
        'https://koinly.com/*',
        'https://cointracker.io/*',
        'https://coinstats.app/*',
        'https://accointing.com/*',

        // Other services
        'https://app.disco.xyz/*',
        'https://dashboard.redefine.net/*',
      ],
      all_frames: true,
      js: ['src/pages/content/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
