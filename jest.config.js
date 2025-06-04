module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>"],
  transform: {
    "\\.[jt]s?$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
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
