import { addTypeTemplate, defineNuxtModule } from '@nuxt/kit'
import { type EnvGeneratorConfig, generateENV } from './logic'

interface Config extends Omit<EnvGeneratorConfig, 'dts'> {}

export default defineNuxtModule<Config>({
  meta: {
    name: 'monorepo-env-merger',
    configKey: 'envMerger',
    compatibility: {
      nuxt: '>=3',
    },
  },

  defaults: {
    outputDir: '.nuxt',
  },

  setup(config, nuxt) {
    const mode = nuxt.options.vite.mode!
    const env = generateENV(mode, {
      ...config,
      dts: false,
    })

    // Add types
    addTypeTemplate({
      filename: 'types/env.d.ts',
      getContents: () => env.dtsContent,
    })

    // Update runtime env
    Object.assign(
      nuxt.options.runtimeConfig.public,
      env.data,
    )

    nuxt.hook('vite:extendConfig', async (options) => {
      // Update vite env
      options.envDir = env.outputDir
    })
  },
})
