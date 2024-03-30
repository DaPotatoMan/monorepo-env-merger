import fs from 'node:fs'
import { resolve } from 'node:path'
import { normalizePath } from 'vite'

export function prepareDir(path: string) {
  if (!fs.existsSync(path))
    fs.mkdirSync(path)
}

export function resolvePath(...paths: string[]) {
  return normalizePath(resolve(...paths))
}
