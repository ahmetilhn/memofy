// Global mocks
global.structuredClone = (input) => JSON.parse(JSON.stringify(input));
global.window = {};
// Clear all mocks after executing all of test in test suites
afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
