#!/usr/bin/env node
const { Command } = require('commander')
const path = require('path')
const program = new Command()

program
  .option('-d, --dir <string>', '项目根路径')
  .option('-i, --ignore <string>', '忽略某个项目，支持正则')
  .option('-s, --slient', '安静模式')
  .option('-f, --force', '强制运行')
  .action(function(cmd, env) {
    const opts = program.opts()
    if (opts.dir && !opts.dir.startsWith('/')) {
      opts.dir = path.resolve(process.cwd(), opts.dir)
    }
    require('../lib/cli')
      .run(opts)
      .catch(console.error)
  })

program.parse(process.argv)
