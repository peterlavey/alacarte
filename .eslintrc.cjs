module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vitest-globals/env': true,
  },
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      files: ['client/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {},
    },
    {
      files: ['**/*.{ts,tsx,jsx,js}'],
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
}
