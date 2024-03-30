import { addTypeTemplate, defineNuxtModule } from '@nuxt/kit'
import { type EnvGeneratorConfig, generateENV, getNuxtRuntimeEnvMap } from './logic'

interface Config extends Omit<EnvGeneratorConfig, 'dts'> {
  /** Expose env variables to nuxt runtime */
  runtime?: boolean
}

export default defineNuxtModule<Config>({
  meta: {
    name: 'monorepo-env',
    configKey: 'monorepoENV',
    compatibility: {
      nuxt: '>=3',
    },
  },

  defaults: {
    runtime: true,
  },

  setup(config, nuxt) {
    const mode = nuxt.options.vite.mode!
    const env = generateENV(mode, {
      ...config,
      dts: false,
    })

    if (config.runtime) {
      const runtimeEnv = getNuxtRuntimeEnvMap(env.data)

      // Update runtime env
      Object.assign(nuxt.options.runtimeConfig, runtimeEnv.private)
      Object.assign(nuxt.options.runtimeConfig.public, runtimeEnv.public)
    }

    // Add vite types
    addTypeTemplate({
      filename: 'types/env.d.ts',
      getContents: () => env.dtsContent,
    })

    nuxt.hook('vite:extendConfig', async (options) => {
      // Update vite env
      options.envDir = env.outputDir
    })
  },
})
