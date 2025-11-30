const baseConfig = require('./index')
const vueRecommended = require.resolve('eslint-plugin-vue/lib/configs/vue3-recommended')

module.exports = {
  ...baseConfig,
  env: {
    ...baseConfig.env,
    browser: true
  },
  parser: 'vue-eslint-parser',
  globals: {
    ...(baseConfig.globals || {}),
    uni: 'readonly'
  },
  extends: [...baseConfig.extends, vueRecommended, 'plugin:vuejs-accessibility/recommended'],
  plugins: [...new Set([...baseConfig.plugins, 'vue', 'vuejs-accessibility'])],
  parserOptions: {
    ...baseConfig.parserOptions,
    extraFileExtensions: ['.vue'],
    parser: {
      ts: '@typescript-eslint/parser'
    }
  },
  rules: {
    ...baseConfig.rules,
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'no-undef': 'off'
  }
}
