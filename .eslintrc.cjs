/* eslint-disable no-undef */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-warning-comments": "warn",
        "no-console": "warn",
        "tsdoc/syntax": "warn"
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint','eslint-plugin-tsdoc'],
    root: true,
};