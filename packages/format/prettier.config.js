/* eslint-disable antfu/no-top-level-await */

const xmlPlugin = (await import('@prettier/plugin-xml')).default
const astroPlugin = await import('prettier-plugin-astro')
const sveltePlugin = (await import('prettier-plugin-svelte')).default

/**
 * @type {import("prettier").Config}
 */
export const phsPrettier = {
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
  plugins: [xmlPlugin, astroPlugin, sveltePlugin],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
}

export default phsPrettier
