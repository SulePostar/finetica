export default {
    testEnvironment: 'jsdom', // za React testove
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Babel transformacija za JS/JSX
    },
    moduleNameMapper: {
        '\\.(css|scss|sass)$': 'identity-obj-proxy', // mock za CSS
        '^@/(.*)$': '<rootDir>/src/$1', // ako koristiš @ alias za src
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // za jest-dom matchere
    setupFiles: ['<rootDir>/src/setupTests.js'], // mock import.meta.env
    transformIgnorePatterns: ['/node_modules/'], // ignoriše node_modules
};
