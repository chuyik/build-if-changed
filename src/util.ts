import { existsSync, lstatSync, readFileSync } from 'fs'

export function isFile(file: string) {
  if (!existsSync(file)) return false
  return lstatSync(file).isFile()
}

export function isDir(file: string) {
  if (!existsSync(file)) return false
  return lstatSync(file).isDirectory()
}

export function readJson(file: string) {
  if (!existsSync(file)) return {}
  return JSON.parse(readFileSync(file, { encoding: 'utf8' }))
}
