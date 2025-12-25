const js = require('@eslint/js');
const globals = require('globals');
const astro = require('eslint-plugin-astro');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['.astro/**', 'dist/**', 'node_modules/**', '.github/**', 'types.generated.d.ts'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  js.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.js'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'no-unused-vars': 'off',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...(tseslint.configs.recommended?.rules ?? {}),
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.astro/*.js', '*.astro/*.js'],
    languageOptions: {
      parser: tsParser,
    },
  },
];
