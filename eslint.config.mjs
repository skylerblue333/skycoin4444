import tseslint from 'typescript-eslint';

const safetyRules = {
  'no-debugger': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-with': 'error',
  'no-constant-binary-expression': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
};

export default [
  {
    ignores: [
      'client/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'docs/**',
      '*.config.*',
    ],
  },
  {
    files: ['server/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: safetyRules,
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: safetyRules,
  },
];
