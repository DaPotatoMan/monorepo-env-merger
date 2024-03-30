import { type Plugin, createLogger } from 'vite'
import { generateENV } from './logic'

export function pluginENVMerge(): Plugin[] {
  const logger = createLogger('info', { prefix: '[vite-plugin-env-merge]', allowClearScreen: true })

  return [
    {
      name: 'env-merge-config',
      enforce: 'pre',

      config(config, env) {
        const { mode } = env
        const { envDir, envPath } = generateENV(mode)

        config.envDir = envDir
        logger.info(`🔗 ENV files generated (${mode}): ${envPath}`)

        return config
      }
    }
  ]
}
