module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'cjs', 'json', 'node'],
  // Use more specific patterns for your module mappings
  moduleNameMapper: {
    '^(\\.{1,2})/controllers/(.+)\\.js$': '$1/controllers/$2.cjs'
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
  setupFiles: ['<rootDir>/jest.setup.js']
};

