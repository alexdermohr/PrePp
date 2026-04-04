import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    fs: {
      allow: [
        // 'here' is strictly required because Vite's fs.allow overrides the default behavior.
        // If omitted, the root app/index.html and any local assets cannot be served.
        here,
        resolve(here, '../docs'),
        resolve(here, '../meta'),
        resolve(here, '../models')
      ]
    }
  }
});
