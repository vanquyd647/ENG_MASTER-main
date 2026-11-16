import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'output/**', 'src/data/**'] },
  ...tseslint.configs.recommended,
  { files: ['**/*.{ts,tsx}'], rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
    '@typescript-eslint/no-empty-object-type': 'off',
  } },
);
