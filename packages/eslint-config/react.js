const baseConfig = require('./index')

module.exports = {
  ...baseConfig,
  env: {
    ...baseConfig.env,
    browser: true
  },
  extends: [...baseConfig.extends, 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: [...new Set([...baseConfig.plugins, 'react', 'react-hooks'])],
  parserOptions: {
    ...baseConfig.parserOptions,
    ecmaFeatures: {
      ...(baseConfig.parserOptions.ecmaFeatures || {}),
      jsx: true
    }
  },
  rules: {
    ...baseConfig.rules,
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
