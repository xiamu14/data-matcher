module.exports = {
  // parser: 'typescript-eslint-parser',
  plugins: [
    // 'typescript'
    'prettier'
  ],
  extends: ["airbnb-typescript/base", "prettier/@typescript-eslint"],
  rules: {
    "no-console": 0,
    "semi": 0
  }
}
