import { addTypeTemplate, defineNuxtModule } from '@nuxt/kit'
import { generateENV } from './logic'

export default defineNuxtModule({
  meta: {
    name: 'env-updater',
    configKey: 'envUpdater',
  },
  defaults: {
    // Default module options
  },
  setup(_options, nuxt) {
    const mode = nuxt.options.vite.mode!
    const { env, envDir, dtsContent } = generateENV(mode, {
      dir: '.nuxt',
      dts: false,
    })

    // Add dts types
    addTypeTemplate({
      filename: 'types/env.d.ts',
      getContents: () => dtsContent,
    })

    // Update runtime env
    Object.assign(
      nuxt.options.runtimeConfig.public,
      env,
    )

    nuxt.hook('vite:extendConfig', async (options) => {
      // Update vite env
      options.envDir = envDir
    })
  },
})
