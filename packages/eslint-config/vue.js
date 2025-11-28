const baseConfig = require('./index')

module.exports = {
  ...baseConfig,
  env: {
    ...baseConfig.env,
    browser: true
  },
  extends: [
    ...baseConfig.extends,
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended'
  ],
  plugins: [...new Set([...baseConfig.plugins, 'vue', 'vuejs-accessibility'])],
  parserOptions: {
    ...baseConfig.parserOptions,
    extraFileExtensions: ['.vue']
  }
}
