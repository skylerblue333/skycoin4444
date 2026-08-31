import tseslint from 'typescript-eslint';

const safetyRules = {
  'no-debugger': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-with': 'error',
  'no-constant-binary-expression': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
};

const canonicalFiles = [
  'server/**/*.{ts,tsx,js,mjs}',
  'packages/**/*.{ts,tsx,js,mjs}',
  'scripts/**/*.{ts,tsx,js,mjs}',
];

export default [
  {
    ignores: [
      'client/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'docs/**',
    ],
  },
  {
    files: canonicalFiles,
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
];
