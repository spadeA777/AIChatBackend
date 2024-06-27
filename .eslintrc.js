module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      'array-bracket-spacing': [0, 'never'],
      'prefer-const': 'warn',
      'no-console': 'off',
      'no-useless-escape': 'off',
      // unknown is I don't know; any is I don't care
      '@typescript-eslint/no-explicit-any': ['off', { ignoreRestArgs: true }],
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/ban-types': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/ban-ts-comment': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-extra-semi': ['off'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    }
};
  