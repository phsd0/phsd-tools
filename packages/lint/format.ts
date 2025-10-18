import type { Config } from 'prettier'

export const phsPrettier: Config = {
  jsxSingleQuote: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
    {
      files: '*.svg',
      options: {
        parser: 'xml',
        xmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
}

export default phsPrettier
