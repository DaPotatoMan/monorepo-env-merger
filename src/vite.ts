import type { Plugin } from 'vite'
import { type EnvGeneratorConfig, generateENV } from './logic'

export default function (config: EnvGeneratorConfig = {}): Plugin {
  return {
    name: 'monorepo-env-merger',
    enforce: 'pre',

    config(viteConfig, { mode }) {
      const env = generateENV(mode, config)

      viteConfig.envDir = env.outputDir
      return viteConfig
    },
  }
}
