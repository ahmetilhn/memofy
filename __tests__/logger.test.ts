import { writeToConsole } from "./../lib/helpers/logger";
describe("logger tests", () => {
  test("it should write log to console", () => {
    jest.spyOn(console, "info").mockImplementation(jest.fn());
    writeToConsole("exampleMethod", "hello world!");
    expect(console.info).toHaveBeenCalledWith(
      "exampleMethod function value returned from memofy cache. Value: hello world!"
    );
  });
});
