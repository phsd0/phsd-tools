import type { Linter } from 'eslint'
import type { RuleOptions } from './typegen'
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import {
  astro,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  pnpm,
  react,
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
} from './configs'
import { regexp } from './configs/regexp'
import { interopDefault } from './utils'

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[]

export const defaultPluginRenaming = {
  '@eslint-react': 'react',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention',

  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-lite': 'import',
  n: 'node',
  perfectionist: 'sort',
  vitest: 'test',
  yml: 'yaml',
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return 'overrides' in sub ? sub.overrides! : {}
}

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function phs(
  options: Omit<TypedFlatConfigItem, 'files'> & OptionsConfig = {},
  ...userConfigs: Awaitable<
    FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    astro: enableAstro = false,
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    imports: enableImports = true,
    jsx: enableJsx = false,
    pnpm: enableCatalogs = false,
    react: enableReact = false,
    regexp: enableRegexp = true,
    sort: enableSort = true,
    svelte: enableSvelte = false,
    test: enableTest = false,
    typescript: enableTypeScript = true,
    unicorn: enableUnicorn = true,
  } = options

  const stylisticOptions = !options.stylistic ? false : typeof options.stylistic === 'object' ? options.stylistic : {}

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'phs/gitignore',
            ...enableGitignore,
          }),
        ]),
      )
    } else {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'phs/gitignore',
            strict: false,
          }),
        ]),
      )
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      overrides: getOverrides(options, 'javascript'),
    }),
    node(),
    jsdoc({
      stylistic: stylisticOptions,
    }),
  )

  if (enableSort) {
    configs.push(perfectionist(enableSort === true ? {} : enableSort))
  }

  if (enableImports) {
    configs.push(
      imports(
        enableImports === true
          ? {
              stylistic: stylisticOptions,
            }
          : {
              stylistic: stylisticOptions,
              ...enableImports,
            },
      ),
    )
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
  }

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, 'typescript'),
        type: options.type,
      }),
    )
  }

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        overrides: getOverrides(options, 'stylistic'),
      }),
    )
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (enableTest) {
    configs.push(
      test({
        overrides: getOverrides(options, 'test'),
      }),
    )
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, 'react'),
        tsconfigPath,
      }),
    )
  }

  if (enableSvelte) {
    configs.push(
      svelte({
        overrides: getOverrides(options, 'svelte'),
        stylistic: stylisticOptions,
        typescript: !!enableTypeScript,
      }),
    )
  }

  if (enableAstro) {
    configs.push(
      astro({
        overrides: getOverrides(options, 'astro'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
      sortTurboConfig(),
    )
  }

  if (options.tailwind ?? false) {
    configs.push(tailwind(options.tailwind))
  }

  if (enableCatalogs) {
    configs.push(pnpm())
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        overrides: getOverrides(options, 'toml'),
        stylistic: stylisticOptions,
      }),
    )
  }

  if (options.markdown ?? false) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, 'markdown'),
      }),
    )
  }

  if (options.formatters) {
    configs.push(formatters(options.formatters || true, typeof stylisticOptions === 'boolean' ? {} : stylisticOptions))
  }

  if ('files' in options) {
    throw new Error(
      'The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    )
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any
    }
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig])
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer.append(...configs, ...(userConfigs as any))

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming)
  }

  return composer
}

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean' ? ({} as any) : options[key] || ({} as any)
}
