import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { defineConfig } from 'tsdown'

const execAsync = promisify(exec)

async function runTypegenScript(): Promise<void> {
  try {
    const { stderr } = await execAsync('pnpm tsx scripts/typegen.ts')
    if (stderr) {
      console.error(stderr)
    }
  } catch (error: any) {
    console.error('Failed to run typegen script:', error)
    throw error
  }
}

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  hooks: {
    'build:prepare': runTypegenScript,
  },
  sourcemap: true,
})
