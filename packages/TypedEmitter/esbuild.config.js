import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

try {
  const result = await build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    sourcemap: true,
    splitting: false,
    minify: false,
    plugins: [nodeExternalsPlugin()],
  })

  console.info('Build completed successfully.', result)
} catch (error) {
  console.error('Build failed:', error)
  throw error
}
