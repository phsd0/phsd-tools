/* eslint-disable antfu/no-top-level-await */
import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import {
  astro,
  combine,
  formatters,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  react,
  regexp,
  sortPackageJson,
  sortTsconfig,
  sortTurboConfig,
  stylistic,
  svelte,
  tailwind,
  test,
  toml,
  typescript,
  unicorn,
  yaml,
} from '../src'

const configs = await combine(
  { plugins: { '': { rules: Object.fromEntries(builtinRules.entries()) } } },
  astro(),
  formatters(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  jsx(),
  markdown(),
  node(),
  perfectionist(),
  react(),
  regexp(),
  sortPackageJson(),
  sortTsconfig(),
  sortTurboConfig(),
  stylistic(),
  svelte(),
  tailwind(),
  test(),
  toml(),
  typescript(),
  unicorn(),
  yaml(),
)

const configNames = configs.map((i) => i.name).filter(Boolean) as string[]

let dts = `/**
 * Generated Types for ESLint rules.
 */


`
dts += await flatConfigsToRulesDTS(configs, { includeAugmentation: false })

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/typegen.d.ts', dts)
