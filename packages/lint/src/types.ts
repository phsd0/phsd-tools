import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type {
  AttributeOption,
  CalleeOption,
  TagOption,
  VariableOption,
} from 'eslint-plugin-better-tailwindcss/api/types'
import type { ConfigNames, RuleOptions } from './typegen'
import type { VendoredPrettierOptions } from './vendor/prettier-types'

export type Awaitable<T> = Promise<T> | T

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export type { ConfigNames }

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable ASTRO support.
   */
  astro?: boolean | OptionsOverrides

  /**
   * Automatically rename plugins in the config.
   */
  autoRenamePlugins?: boolean

  /**
   * Use external formatters to format files.
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Enable gitignore support.
   */
  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Options for eslint-plugin-import-lite.
   */
  imports?: boolean | OptionsOverrides

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable JSONC support.
   */
  jsonc?: boolean | OptionsOverrides

  /**
   * Enable JSX related rules.
   */
  jsx?: boolean

  /**
   * Enable linting for **code snippets** in Markdown.
   */
  markdown?: boolean | OptionsOverrides
  /**
   * Enable pnpm (workspace/catalogs) support.
   * @experimental
   */
  pnpm?: boolean

  /**
   * Enable react rules.
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable regexp rules.
   */
  regexp?: boolean | (OptionsOverrides & OptionsRegExp)

  /**
   * Enable sorting rules.
   */
  sort?: boolean | OptionsSort

  /**
   * Enable stylistic rules.
   */
  stylistic?: boolean | (OptionsOverrides & StylisticConfig)

  /**
   * Enable svelte rules.
   */
  svelte?: boolean | OptionsOverrides

  /**
   * Enable tailwind support.
   */
  tailwind?: OptionsTailwind

  /**
   * Enable test support.
   */
  test?: boolean | OptionsOverrides

  /**
   * Enable TOML support.
   */
  toml?: boolean | OptionsOverrides

  /**
   * Enable TypeScript support.
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Options for eslint-plugin-unicorn.
   */
  unicorn?: boolean | OptionsUnicorn

  /**
   * Enable YAML support.
   */
  yaml?: boolean | OptionsOverrides
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsFormatters {
  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: 'prettier' | boolean

  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: 'prettier' | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: 'dprint' | 'prettier' | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: 'prettier' | boolean

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   */
  type?: 'app' | 'lib'
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn'
}

export interface OptionsSort extends OptionsOverrides {
  arrayIncludes?: boolean
  classes?: boolean
  decorators?: boolean
  enums?: boolean
  heritageClauses?: boolean
  interfaces?: boolean
  intersectionTypes?: boolean
  jsxProps?: boolean
  maps?: boolean
  modules?: boolean
  objects?: boolean
  objectTypes?: boolean
  sets?: boolean
  switchCase?: boolean
  unionTypes?: boolean
  variableDeclarations?: boolean
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface OptionsTailwind
  extends OptionsOverrides,
    Partial<CalleeOption>,
    Partial<AttributeOption>,
    Partial<TagOption>,
    Partial<VariableOption> {
  tailwindConfig: string
}

export type OptionsTypescript =
  | (OptionsOverrides & OptionsTypeScriptParserOptions)
  | (OptionsOverrides & OptionsTypeScriptWithTypes)

export interface OptionsTypeScriptParserOptions {
  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]

  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']

  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string
}

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @default false
   */
  allRecommended?: boolean
}

export interface Rules extends RuleOptions {}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'commaDangle' | 'indent' | 'jsx' | 'quotes' | 'semi'> {}

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
}
