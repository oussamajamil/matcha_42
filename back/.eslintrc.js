export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['*.ts}'],
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error'],
    'import/extensions': [0],
    'class-methods-use-this': [0],
  },
};
