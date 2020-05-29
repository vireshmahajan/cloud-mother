module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: './server/tsconfig.json'
    },
    env: {
        node: true
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/type-annotation-spacing": 2,
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": 0
    }
};
