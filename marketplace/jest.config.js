module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 55,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
    ],
    moduleNameMapper: {
        '\\.(css|scss|pcss)$': 'identity-obj-proxy',
        '\\.(png)$': 'empty/object',
    },
    setupTestFrameworkScriptFile: '<rootDir>/test/test-utils/setupTests.js',
    setupFiles: [
        'jest-localstorage-mock',
    ],
}
