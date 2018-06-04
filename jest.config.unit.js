module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            lines: 6,
        },
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
    ],
}
