import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

export default tseslint.config({
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  ignores: ['node_modules', 'dist'],
  plugins: {
    vitest,
  },
  rules: {
    ...vitest.configs.recommended.rules,
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
    parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
    },
  },
  extends: [eslint.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
});
