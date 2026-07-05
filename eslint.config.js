// ESLint flat config (ESLint 9+). Lints the TypeScript sources under src/.
// no-undef is left to TypeScript (typescript-eslint's recommended set disables
// it), so browser globals don't need to be declared here.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      // The card leans on `any` in a few deliberate spots (dynamic service
      // payloads, sort comparators); don't fail the lint over them.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
