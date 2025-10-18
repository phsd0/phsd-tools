import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  commaDangle: 'always-multiline',
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
}

export interface StylisticOptions extends OptionsOverrides, StylisticConfig {
  lessOpinionated?: boolean
}

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      name: 'phs/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',
        'antfu/if-newline': 'error',
        'antfu/top-level-function': 'error',
        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/quote-props': ['error', 'as-needed'],
        'style/yield-star-spacing': ['error', { after: true, before: false }],
        ...overrides,
      },
    },
  ]
}
