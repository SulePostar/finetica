module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./src/tests/setupTests.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
        // ako imaš asset fajlove (css, slike itd.)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};
