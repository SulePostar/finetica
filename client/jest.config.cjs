module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$|.*\\.js$|.*\\.jsx$))"
  ],
  globals: {
    "import.meta": {
      env: {
        VITE_API_BASE_URL: "http://localhost:4000/api"
      }
    }
  }
};

