module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/*.test.js',
        '**/*.spec.js'
    ],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'services/**/*.js',
        'utils/**/*.js',
        'helpers/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/migrations/**',
        '!**/seeders/**'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 10000,
    verbose: true
};
