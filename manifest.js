import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const defaultSites = [
  // Block explorers
  'https://*.etherscan.io/*',
  'https://blockscan.com/*',
  'https://*.polygonscan.com/*',
  'https://*.arbiscan.io/*',
  'https://*.gnosisscan.io/*',
  'https://*.basescan.org/*',
  'https://*.explorer.zksync.io/*',
  'https://explorer.celo.org/*',
  'https://*.celoscan.io/*',
  'https://*.blockscout.com/*',
  'https://explorer.bitquery.io/*',
  'https://*.onceupon.xyz/*',

  // Multisig management services
  'https://app.safe.global/*',
  'https://safe.celo.org/*',

  // Developer services
  'https://bugs.immunefi.com/*',
  'https://dashboard.tenderly.co/*',
  'https://defender.openzeppelin.com/*',

  // Portfolio trackers
  'https://coinshift.xyz/*',
  'https://koinly.io/*',
  'https://cointracker.io/*',
  'https://coinstats.app/*',
  'https://accointing.com/*',

  // Other services
  'https://app.disco.xyz/*',
  'https://dashboard.redefine.net/*',
  'https://bankless.com/*',
];

const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  // name: '__MSG_extensionName__',
  // description: '__MSG_extensionDescription__',
  permissions: [
    // activeTab is documented as required by webext-permission-toggle,
    // but doesn't seem to be required on Chrome with MV2 or MV3.
    // See https://github.com/fregante/webext-permission-toggle/issues/50
    //
    // In any case, it's definitely required in order for the hotkey to
    // be able to popup the search modal dialog.
    'activeTab',
    //
    // See also https://github.com/rolod0x/rolod0x/issues/216
    // which may require activeTab in the future.

    'clipboardWrite', // See SECURITY.md
    'contextMenus', // See SECURITY.md
    'scripting', // See SECURITY.md
    // 'sidePanel',
    'storage', // See SECURITY.md
  ],

  // Anything in content_scripts.matches must also be in host_permissions:
  // https://github.com/fregante/webext-permissions/issues/22#issuecomment-1902184704
  host_permissions: defaultSites,

  optional_permissions: [],

  // This allows webext-dynamic-content-scripts and webext-permission-toggle
  // to add new hosts:
  optional_host_permissions: ['*://*/*'],

  content_security_policy: {
    extension_pages: [
      "script-src 'self'",
      // Use this version instead to allow react-devtools <script> tag.
      // "script-src http://localhost:8097 'self'",

      "object-src 'self'",

      // Not sure if this is needed
      // "connect-src ws://localhost:8081 ws://localhost:8097 'self'",
    ].join(';'),
  },
  // side_panel: {
  //   default_path: 'src/pages/sidepanel/index.html',
  // },
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-38.png',
  },
  icons: {
    38: 'icon-38.png',
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: [
        // We need at least one host here otherwise the extension won't load,
        // as per https://github.com/fregante/webext-dynamic-content-scripts#usage
        'https://*.etherscan.io/*',

        // But we don't need the rest:
        // ...defaultSites,
      ],
      all_frames: true,
      js: ['src/pages/content/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
    // If multiple content scripts are required, see:
    // https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177#issuecomment-1784112536
  ],
  web_accessible_resources: [
    {
      resources: [
        'src/pages/lookup/ui/index.html',
        'src/pages/content/contextMenu/index.html',
        'assets/js/*.js',
        'assets/css/*.css',
        'icon-128.png',
        'icon-104x100-no-bg.png',
        'icon-38.png',
      ],
      matches: ['*://*/*'],
    },
  ],
  commands: {
    lookupAddress: {
      suggested_key: {
        default: 'Shift+Alt+Space',
        mac: 'Shift+Command+Space',
      },
      description: 'Look up an address',
    },
  },
};

export default manifest;
