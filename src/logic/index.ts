import fs from 'node:fs'
import process from 'node:process'
import { loadEnv } from 'vite'
import { monorepoRootSync } from 'monorepo-root'
import { prepareDir, resolvePath } from './utils'

type EnvMap = Record<string, string | boolean>

export interface EnvGeneratorConfig {
  /**
   * Current project path
   * @default ```ts
   * process.cwd()
   * ```
   */
  cwd?: string

  /** Monorepo project root path */
  root?: string | null

  /**
   * Folder where .env file will be generated
   * @default node_modules/.env
   */
  outputDir?: string

  /**
   * Path of env types
   * @default {cwd}/env.d.ts
   */
  dts?: boolean | `${string}.d.ts`
}

/** Generates types for .env */
function generateTypes(mode: string, env: EnvMap) {
  const dtsEnvMap = Object.entries(env)
    .map(([key, value]) => `  readonly ${key}: ${JSON.stringify(value)}`)
    .join('\n')

  const content = `
// Generated by monorepo-env-merger
// mode = ${mode}

/// <reference types="vite/client" />

interface ImportMetaEnv {
${dtsEnvMap}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`

  return content.trim()
}

/** Generates .env file content */
function getEnvContent(mode: string, data: EnvMap) {
  let content = `# Generated by monorepo-env-merger\n# mode = ${mode}\n`

  for (const key in data)
    content += `\n${key}=${data[key]}`

  return content
}

export function generateENV(mode: string, {
  cwd = process.cwd(),
  root = monorepoRootSync(),
  outputDir: outputDirRaw = 'node_modules/.env',
  dts = true,
}: Partial<EnvGeneratorConfig> = {}) {
  if (!root)
    throw new Error('projectRoot not defined')

  /** Where .env file will be generated */
  const outputDir = resolvePath(outputDirRaw)

  /** Generated .env path */
  const outputPath = resolvePath(outputDir, '.env')

  /** Parsed env map */
  const data = {
    // Root
    ...loadEnv(mode, root),

    // Local
    ...loadEnv(mode, cwd),
  }

  const envContent = getEnvContent(mode, data)
  const dtsContent = generateTypes(mode, data)

  // Generate .env file
  prepareDir(outputDir)
  fs.writeFileSync(outputPath, envContent)

  // Generate dts file
  if (dts) {
    const dtsPath = resolvePath(typeof dts === 'string' ? dts : 'env.d.ts')
    fs.writeFileSync(dtsPath, dtsContent)
  }

  return { data, outputDir, outputPath, dtsContent }
}
