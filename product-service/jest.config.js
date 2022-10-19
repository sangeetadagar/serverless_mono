module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: [
    '<rootDir>'
  ],
  moduleNameMapper: {
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
};


