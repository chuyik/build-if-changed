import {
  findPackages,
  loadPackages,
  getChanged,
  buildPackages,
  Options,
} from '.'
import { GitIgnore } from './gitignore'
import { resolve } from 'path'
import createLog from './log'
import fs = require('saxon/sync')

interface CLIOptions extends Options {
  help?: boolean
}

exports.run = async (opts: CLIOptions = {} as any) => {
  const log = createLog(opts)

  if (opts.help) {
    log(fs.read(resolve(__dirname, '..', 'help.txt')))
    process.exit()
  }

  if (opts.cwd == null) {
    opts.cwd = opts.dir || process.cwd()
  }

  const filter = opts.filter
  const gitIgnore = new GitIgnore(opts.cwd)
  opts.filter = (file, name) =>
    !gitIgnore.test(file, name) && (!filter || filter(file, name))

  // Load "package.json" modules into memory.
  const packagePaths = await findPackages(opts)
  if (!packagePaths.length) {
    log('⚠️  No packages were found.')
    return []
  }

  // Find which packages have changed.
  const packages = loadPackages(packagePaths, opts)
  const changed = await getChanged(packages, opts)
  if (!changed.length) {
    log('✨  No changes were found.')
    return []
  }

  log(`📦  Building ${changed.length} ${plural('package', changed.length)}...`)
  try {
    await buildPackages(changed, opts)
    log(`✨  Finished without errors.`)
  } catch {
    log(`💥  Build failed. Check the logs above.`)
    process.exit(1)
  }
}

function plural(word, count) {
  return count == 1 ? word : word + 's'
}
