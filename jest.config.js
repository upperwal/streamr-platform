module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 24,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
    ],
}
