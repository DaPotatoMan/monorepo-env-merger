import { monorepoRootSync } from 'monorepo-root'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  monorepoENV: {
    root: monorepoRootSync(),
    cwd: __dirname,
  },
})
