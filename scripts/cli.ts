import os from 'node:os'
import path from 'node:path'
import { build } from './build.ts'

const command = process.argv[2]

await build({
  name: 'Npm Userscript',
  watch: command === 'dev',
  inputFile: 'src/index.ts',
  outputDir: 'dist',
  userscriptDir: path.join(
    os.homedir(),
    'Library/Containers/com.userscripts.macos.Userscripts-Extension/Data/Documents/scripts',
  ),
  userscriptMeta: {
    namespace: 'https://greasyfork.org/',
    match: 'https://www.npmjs.com/**',
    grant: 'none',
    'run-at': 'document-start',
  },
})
