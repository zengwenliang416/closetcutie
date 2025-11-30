module.exports = {
  root: true,
  extends: ['@closetcutie/eslint-config/react'],
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
}
