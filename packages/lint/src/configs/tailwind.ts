import type { OptionsTailwind, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export async function tailwind(options: Partial<OptionsTailwind> = {}): Promise<TypedFlatConfigItem[]> {
  const { attributes = [], callees = [], overrides = {}, tags = [], tailwindConfig, variables = [] } = options

  const { getDefaultAttributes, getDefaultCallees, getDefaultTags, getDefaultVariables } = await import(
    'eslint-plugin-better-tailwindcss/api/defaults'
  )
  const defaults = {
    attributes: [...getDefaultAttributes(), ...attributes],
    callees: [...getDefaultCallees(), ...callees],
    tags: [...getDefaultTags(), ...tags],
    variables: [...getDefaultVariables(), ...variables],
  }
  return [
    {
      name: 'phs/tailwind/rules',
      plugins: {
        tw: await interopDefault(import('eslint-plugin-better-tailwindcss')),
      },
      rules: {
        'tw/enforce-consistent-class-order': [
          'error',
          {
            order: 'improved',
            ...defaults,
            entryPoint: tailwindConfig,
          },
        ],
        'tw/enforce-consistent-line-wrapping': [
          'error',
          {
            entryPoint: tailwindConfig,
            group: 'newLine',
            printWidth: 10000,
            ...defaults,
          },
        ],
        'tw/enforce-consistent-variable-syntax': [
          'error',
          {
            syntax: 'parentheses',
            ...defaults,
          },
        ],
        'tw/no-conflicting-classes': [
          'error',
          {
            ...defaults,
            entryPoint: tailwindConfig,
          },
        ],
        'tw/no-duplicate-classes': [
          'error',
          {
            ...defaults,
          },
        ],
        'tw/no-restricted-classes': [
          'error',
          {
            ...defaults,
          },
        ],
        'tw/no-unnecessary-whitespace': [
          'error',
          {
            allowMultiline: true,
            ...defaults,
          },
        ],
        'tw/no-unregistered-classes': [
          'error',
          {
            detectComponentClasses: false,
            entryPoint: tailwindConfig,
            ...defaults,
          },
        ],
        ...overrides,
      },
      settings: {
        'better-tailwindcss': {
          entryPoint: tailwindConfig,
        },
      },
    },
  ]
}
