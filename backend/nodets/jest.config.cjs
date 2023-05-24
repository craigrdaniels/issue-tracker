/** @type {import('ts-jest').JestConfigWithTsJest} */
// import { type Config } from 'jest'

const config = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],

  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  }
}
module.exports = config
