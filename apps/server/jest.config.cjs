module.exports = {
  testEnvironment: 'node',
  transform: {},
  // Remove extensionsToTreatAsEsm since .js is automatically treated as ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  clearMocks: true,
  restoreMocks: true,
};
