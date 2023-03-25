module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
    'standard-with-typescript'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: ['import', 'node', '@typescript-eslint', 'prettier'],

  settings: {
    node: {
      tryExtensions: ['.js', '.ts']
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    }
  },

  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'prettier/prettier': 'error',
    'no-restricted-imports': 'off',
    'node/no-missing-import': 'off'
  }
}
