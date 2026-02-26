import { fileURLToPath, URL } from 'node:url'
import cryptoModule from 'node:crypto'

// Polyfill crypto.hash for Node.js < 21.7.0 (used by @vitejs/plugin-vue 6.x)
// Patches the node:crypto module singleton so all importers see it.
if (typeof (cryptoModule as typeof cryptoModule & { hash?: unknown }).hash !== 'function') {
  ;(cryptoModule as typeof cryptoModule & { hash: (alg: string, data: string | Buffer, out?: string) => string }).hash = (
    alg,
    data,
    out = 'hex',
  ) => cryptoModule.createHash(alg).update(data).digest(out)
}

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
