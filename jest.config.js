module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    testMatch: ['**/integration-test/**/*.test.ts'],
    transformIgnorePatterns: ["node_modules/(?!@mymodule)"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 500000
};