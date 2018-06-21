module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 33,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
    ],
    moduleNameMapper: {
        '\\.(css|scss|pcss)$': 'empty/object',
    },
    setupTestFrameworkScriptFile: '<rootDir>/test/test-utils/setupTests.js',
}
