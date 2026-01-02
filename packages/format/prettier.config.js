/**
 * @type {import("prettier").Config}
 */
export const phsPrettier = {
  jsxSingleQuote: true,
  overrides: [
    {
      files: ['**/*.json', '**/*.jsonc'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
  ],
  plugins: ['prettier-plugin-xml', 'prettier-plugin-astro', 'prettier-plugin-svelte'],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
}

export default phsPrettier
