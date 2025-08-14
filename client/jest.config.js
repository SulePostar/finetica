export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    collectCoverage: false,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
        '!src/main.jsx',
        '!src/tests/**',
        '!src/**/*.test.{js,jsx}',
        '!src/**/*.spec.{js,jsx}'
    ],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
        '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
    ],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    verbose: true,
    clearMocks: true,
    resetMocks: false,
    restoreMocks: false,
    testTimeout: 5000,
    errorOnDeprecated: true,
};