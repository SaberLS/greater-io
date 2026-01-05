import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

try {
  const result = await build({
    entryPoints: [
      'src/index.ts',
      'src/utils/index.ts',
      'src/constants/index.ts',
    ],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    platform: 'neutral',
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
