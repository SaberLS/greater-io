// esbuild.config.js
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'node:path'

const isDev = process.env.NODE_ENV === 'development'

try {
  const result = await build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    sourcemap: isDev,
    minify: !isDev,
    splitting: false,
    external: [], // can be used to exclude specific packages manually
    plugins: [
      nodeExternalsPlugin(), // keeps node_modules out of the bundle
    ],
    tsconfig: path.resolve('./tsconfig.json'),
    logLevel: 'info',
  })

  console.log('Build completed successfully.', result)
} catch (error) {
  console.error('Build failed:', error)
  throw error
}
