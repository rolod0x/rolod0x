import path, { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';

import makeManifest from './utils/plugins/make-manifest';
import customDynamicImport from './utils/plugins/custom-dynamic-import';
import addHmr from './utils/plugins/add-hmr';
import watchRebuild from './utils/plugins/watch-rebuild';
// import inlineVitePreloadScript from './utils/plugins/inline-vite-preload-script';
import muteWarningsPlugin from './utils/plugins/mute-warnings';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const pagesDir = resolve(srcDir, 'pages');
const assetsDir = resolve(srcDir, 'assets');
const outDir = resolve(rootDir, 'dist', process.env.__FIREFOX__ ? 'firefox' : 'chrome');
const publicDir = resolve(rootDir, 'public');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;
const cacheInvalidationKeyRef = { current: generateKey() };

const warningsToIgnore = [
  ['SOURCEMAP_ERROR', "Can't resolve original location of error"],
  // ['MODULE_LEVEL_DIRECTIVE'],
  // ['INVALID_ANNOTATION', 'contains an annotation that Rollup cannot interpret'],
];

export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
    makeManifest({
      getCacheInvalidationKey,
    }),
    react(),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    isDev && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
    // inlineVitePreloadScript(),
    muteWarningsPlugin(warningsToIgnore),
  ],
  publicDir,
  build: {
    outDir,
    /** Can slow down build speed. */
    sourcemap: true, // isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        content: resolve(pagesDir, 'content', 'index.ts'),
        update: resolve(pagesDir, 'content', 'contextMenu', 'index.html'),
        lookup: resolve(pagesDir, 'lookup', 'index.ts'),
        lookupUi: resolve(pagesDir, 'lookup', 'ui', 'index.html'),
        background: resolve(pagesDir, 'background', 'index.ts'),
        contentStyle: resolve(pagesDir, 'content', 'style.scss'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
        sidepanel: resolve(pagesDir, 'sidepanel', 'index.html'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName =
            name === 'contentStyle' ? `${name}${getCacheInvalidationKey()}` : name;
          return `assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
    },
  },
});

function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}
function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey(): string {
  return `${Date.now().toFixed()}`;
}
