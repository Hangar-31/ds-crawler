module.exports = {
  extends: [
    'plugin:import/typescript',
    '@hangar31/eslint-config-h31/reacttypescript',
    'next',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  plugins: ['import'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Style imports.
          ['^.+\\.s?css$', '^.+\\.[Ss]tyled$'],
          // Packages. `react` related packages come first.
          ['react$', 'prop-types'],
          // node_module packages
          ['^@?\\w', '^\\u0000'],
          // Side effect imports.
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
