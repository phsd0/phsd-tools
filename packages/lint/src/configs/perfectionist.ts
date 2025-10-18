import type { OptionsSort, TypedFlatConfigItem } from '../types'

import { pluginPerfectionist } from '../plugins'

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(options: OptionsSort = {}): Promise<TypedFlatConfigItem[]> {
  const {
    arrayIncludes = true,
    classes = false,
    decorators = true,
    enums = true,
    heritageClauses = true,
    interfaces = true,
    intersectionTypes = true,
    jsxProps = true,
    maps = false,
    modules = false,
    objects = true,
    objectTypes = true,
    overrides = {},
    sets = true,
    switchCase = true,
    unionTypes = true,
    variableDeclarations = true,
  } = options
  return [
    {
      name: 'phs/sort/setup',
      plugins: {
        sort: pluginPerfectionist,
      },
    },
    {
      name: 'phs/sort/rules',
      rules: {
        'sort/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'sort/sort-imports': [
          'error',
          {
            groups: [
              'type',
              ['parent-type', 'sibling-type', 'index-type', 'internal-type'],

              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'object',
              'unknown',
            ],
            newlinesBetween: 'ignore',
            order: 'asc',
            type: 'natural',
          },
        ],
        'sort/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'sort/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
        // Sorts
        ...(variableDeclarations
          ? {
              'sort/sort-variable-declarations': ['error', { order: 'asc', type: 'natural' }],
            }
          : {}),
        ...(intersectionTypes ? { 'sort/sort-intersection-types': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(heritageClauses ? { 'sort/sort-heritage-clauses': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(arrayIncludes ? { 'sort/sort-array-includes': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(objectTypes ? { 'sort/sort-object-types': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(unionTypes ? { 'sort/sort-union-types': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(switchCase ? { 'sort/sort-switch-case': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(decorators ? { 'sort/sort-decorators': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(interfaces ? { 'sort/sort-interfaces': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(jsxProps ? { 'sort/sort-jsx-props': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(modules
          ? {
              'sort/sort-modules': [
                'error',
                {
                  order: 'asc',
                  partitionByComment: {
                    block: false,
                    line: true,
                  },
                  type: 'natural',
                },
              ],
            }
          : {}),
        ...(classes ? { 'sort/sort-classes': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(objects ? { 'sort/sort-objects': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(enums ? { 'sort/sort-enums': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(sets ? { 'sort/sort-sets': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...(maps ? { 'sort/sort-maps': ['error', { order: 'asc', type: 'natural' }] } : {}),
        ...overrides,
      },
    },
  ]
}
