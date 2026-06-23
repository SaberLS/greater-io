import type { Config } from 'jest'

console.log(`✅ Loaded Jest config from: ${import.meta.dirname}`)

const config: Config = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'esbuild-jest',
      {
        platform: 'node',
        target: 'node20',
        bundle: true,
        packages: 'bundle',
      },
    ],
  },
  testEnvironment: 'node',
  // eslint-disable-next-line no-useless-escape
  testRegex: '(/__tests__/src.*(\.|/)(test|spec))\.(ts|tsx|js|jsx)$',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
}

export default config
