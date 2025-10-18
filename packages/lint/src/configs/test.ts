import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_TESTS } from '../globs'
import { interopDefault } from '../utils'

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any

export async function test(options: OptionsFiles & OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const { files = GLOB_TESTS, overrides = {} } = options

  const [pluginVitest] = await Promise.all([interopDefault(import('@vitest/eslint-plugin'))] as const)

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
    },
  }

  return [
    {
      name: 'phs/test/setup',
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: 'phs/test/rules',
      rules: {
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/no-only-tests': 'error',

        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        // Disables
        ...{
          'antfu/no-top-level-await': 'off',
          'no-unused-expressions': 'off',
          'node/prefer-global/process': 'off',
          'ts/explicit-function-return-type': 'off',
        },

        ...overrides,
      },
    },
  ]
}
