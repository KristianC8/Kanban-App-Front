import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import eslintPluginPrettierRecomend from 'eslint-plugin-prettier/recommended'

export default [
  { ignores: ['dist/'] },
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecomend,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none',
          singleQuote: true,
          jsxSingleQuote: true,
          semi: false
        }
      ]
    }
  }
]
