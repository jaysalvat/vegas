import jaysalvat from '@jaysalvat/eslint-config'

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '*.min.js'
    ]
  },
  ...jaysalvat,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        getComputedStyle: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Image: 'readonly',
        CustomEvent: 'readonly'
      }
    }
  },
  {
    files: [ 'scripts/**/*.js' ],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    }
  }
]
