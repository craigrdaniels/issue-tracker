const config = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}

module.exports = config
