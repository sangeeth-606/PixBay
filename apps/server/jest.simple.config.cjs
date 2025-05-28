module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'cjs'],
  transform: {
    '^.+\\.(js|cjs)$': 'babel-jest'
  },
  collectCoverage: true,
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
};
