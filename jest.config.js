module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
  testEnvironment: "jsdom",
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageThreshold: {
    global: {
      branches: 81,
      functions: 92,
      lines: 86,
      statements: 83,
    },
  },
};
