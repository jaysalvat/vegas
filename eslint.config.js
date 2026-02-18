import jaysalvat from '@jaysalvat/eslint-config'

export default [
    ...jaysalvat,
    {
        languageOptions: {
            ecmaVersion: 2020,
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
    }
]