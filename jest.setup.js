global.user = { name: "Jack" };
// Clear all mocks after executing all of test in test suites
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
