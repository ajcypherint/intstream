module.exports = {
  env: {
    browser: true,
    jest: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-unused-vars': 'warn', // todo(aj) fix
    'no-import-assign': 'warn', // jest
    camelcase: 'warn', // todo(aj) fix
    'react/prop-types': 'warn',
    'react/display-name': 'warn',
    'no-prototype-builtins': 'warn',
    'no-useless-constructor': 'warn' // todo(aj) fix
  }
}
