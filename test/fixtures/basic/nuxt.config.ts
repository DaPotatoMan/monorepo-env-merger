import EnvMerger from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    EnvMerger,
  ],

  monorepoENV: {
    cwd: 'playground',
  },
})
