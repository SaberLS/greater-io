import eslint from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import type { Config, ConfigArray } from 'typescript-eslint'
import tseslint from 'typescript-eslint'

const createConfig = (__dirname: string): Config => {
  console.info({ __dirname })
  const ts = tseslint
    .config(
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: __dirname,
          },
        },
        rules: {
          '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
              allowExpressions: false,
              allowTypedFunctionExpressions: false,
              allowHigherOrderFunctions: false,
            },
          ],
        },
      }
    )
    .map(config => ({
      ...config,
      files: ['**/*.{mts,cts,tsx,ts}'],
    }))

  const baseEslintConfig = [
    {
      name: 'Ignores',
      ignores: ['public/**', 'node_modules/**', 'dist/**'],
    },
    {
      files: ['**/*.{mts,cts,tsx,ts}'],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: __dirname,
        },
      },
    },
    ...ts,
    pluginReact.configs.flat.recommended,
    {
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    eslintPluginUnicorn.configs.recommended,
    {
      rules: {
        'no-undef': 'error',
        'react/react-in-jsx-scope': 'off',
        'unicorn/prevent-abbreviations': 'off',
      },
    },
    {
      files: ['**/*.{jsx,tsx}'],
      rules: {
        'no-console': 'warn',
        'unicorn/filename-case': [
          'error',
          {
            case: 'pascalCase',
          },
        ],
      },
    },
    {
      files: ['**/*.{js,mjs,mts,cts,cjs,ts,}'],
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
    {
      files: ['**/*.{js,mjs,mts,cts,cjs,ts,jsx,tsx}'],
      languageOptions: {
        ecmaVersion: 'latest',
        globals: { ...globals.browser, ...globals.node },
      },

      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
    {
      files: ['**/__tests__/**/*.{js,mjs,mts,cts,cjs,ts,jsx,tsx}'],
      ...pluginJest.configs['flat/recommended'],
      plugins: { jest: pluginJest },
      languageOptions: {
        globals: pluginJest.environments.globals.globals,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: __dirname + `/__tests__`,
        },
      },
      rules: {
        ...pluginJest.configs['flat/recommended'].rules,
        '@typescript-eslint/explicit-function-return-type': 'off',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ]

  return baseEslintConfig as ConfigArray
}

export default createConfig
export { createConfig }
