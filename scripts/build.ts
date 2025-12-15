import fs from 'node:fs/promises'
import fss from 'node:fs'
import path from 'node:path'
import * as esbuild from 'esbuild'
import { styleText } from 'node:util'

interface BuildOptions {
  name?: string
  watch?: boolean
  rootDir?: string
  inputFile: string
  outputDir: string
  userscriptDir?: string
  userscriptMeta?: Record<string, string>
}

export async function build(options: BuildOptions) {
  const rootDir = options.rootDir ? path.resolve(options.rootDir) : process.cwd()

  let pkg: Record<string, any>
  try {
    pkg = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'))
  } catch (e) {
    throw new Error('Failed to read package.json', { cause: e })
  }

  const name = options.name || pkg.name
  if (!name) {
    throw new Error(
      'Package name is not defined. Please provide a name in package.json or in build options.',
    )
  }

  let userscriptDir = options.userscriptDir
  if (userscriptDir && !fss.existsSync(userscriptDir)) {
    console.warn(
      styleText(
        'yellow',
        `Userscript directory does not exist at "${userscriptDir}". ` +
          `You may need to edit the \`userscriptDir\` for your machine, or disable the option.`,
      ),
    )
    userscriptDir = undefined
  }

  const esbuildOptions: esbuild.BuildOptions = {
    entryPoints: [path.resolve(rootDir, options.inputFile)],
    outfile: path.resolve(rootDir, options.outputDir, `${name}.user.js`),
    bundle: true,
    format: 'iife',
    logLevel: 'info',
    banner: {
      js: userscriptMetaToString({
        name,
        version: pkg.version,
        description: pkg.description,
        license: pkg.license,
        author: pkg.author,
        ...options.userscriptMeta,
      }),
    },
    plugins: userscriptDir ? [esbuildCopyToUserscriptDirPlugin(userscriptDir, name)] : [],
  }

  const watch = options.watch ?? false
  if (watch) {
    const ctx = await esbuild.context(esbuildOptions)
    await ctx.watch()
  } else {
    await esbuild.build(esbuildOptions)
  }
}

function userscriptMetaToString(meta: Record<string, string | undefined>) {
  let str = '// ==UserScript==\n'

  const entries = Object.entries(meta)
  const maxKeyLength = Math.max(...entries.map(([key]) => key.length))
  for (const [key, value] of entries) {
    if (!value?.trim()) continue
    str += `// @${key.padEnd(maxKeyLength + 2)}${value.trim()}\n`
  }

  str += '// ==/UserScript==\n'
  return str
}

function esbuildCopyToUserscriptDirPlugin(userscriptDir: string, name: string): esbuild.Plugin {
  return {
    name: 'copy-to-userscript-dir',
    setup(build: esbuild.PluginBuild) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) return

        const outfile = build.initialOptions.outfile
        if (!outfile) return

        const destPath = path.join(userscriptDir, `${name} (Local).user.js`)
        const outContent = await fs.readFile(outfile, 'utf8')
        const modifiedContent = outContent.replace(
          /\/\/ @name\s+(.+)\n/,
          (m, $1) => m.slice(0, m.indexOf($1)) + $1 + ' (Local)\n',
        )

        await fs.writeFile(destPath, modifiedContent)
      })
    },
  }
}
