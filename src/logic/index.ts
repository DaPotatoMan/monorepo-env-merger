import fs from 'node:fs'
import process from 'node:process'
import { loadEnv } from 'vite'
import { monorepoRootSync } from 'monorepo-root'
import { prepareDir, resolvePath } from './utils'

function generateTypes(env: Record<string, string>) {
  const dtsEnvMap = Object.entries(env).map(([key, value]) => `\s\sreadonly ${key}: '${value}'`).join('\n')

  return `
/// <reference types="vite/client" />

interface ImportMetaEnv {
  ${dtsEnvMap}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`
}

export interface EnvGeneratorConfig {
  /** Current project path */
  cwd?: string

  /** Monorepo project root path */
  root?: string
}

export function generateENV(mode: string, {
  localDir = process.cwd(),
  projectRoot = monorepoRootSync(),

  /** Folder where env files will be generated */
  dir = 'node_modules/.env',

  dts = true,
} = {}) {
  if (!projectRoot)
    throw new Error('projectRoot not defined')

  const envDir = resolvePath(dir)
  const envPath = resolvePath(envDir, '.env')
  const dtsPath = resolvePath(envDir, 'vite-env.d.ts')

  const rootENV = loadEnv(mode, projectRoot)
  const localENV = loadEnv(mode, localDir)

  const env = Object.assign({}, rootENV, localENV)
  const envString = Object.entries(env).map(([key, value]) => `${key}=${value}`).join('\n')
  const dtsContent = generateTypes(env)

  prepareDir(envDir)
  fs.writeFileSync(envPath, envString)
  if (dts)
    fs.writeFileSync(dtsPath, dtsContent)

  return { env, envDir, envPath, dtsPath, dtsContent }
}
