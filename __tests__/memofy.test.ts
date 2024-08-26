import memofy from "../lib";
describe("tests without caching", () => {
  test("should return value with params", () => {
    const concatPhoneNumber = memofy(
      (_extension: number, _number: number): string => {
        return `${_extension}+${_number}`;
      }
    );
    expect(concatPhoneNumber(90, 5555551)).toStrictEqual("90+5555551");
  });

  test("should return value without params", () => {
    const returnName = memofy(() => "Jack");
    expect(returnName()).toStrictEqual("Jack");
  });

  test("should return value with multiply parameters", () => {
    const sumNumbers = memofy(
      (a: number, b: number, c: number, d: number, e: number) =>
        a + b + c + d + e
    );
    expect(sumNumbers(1, 2, 3, 4, 5)).toEqual(15);
  });

  test("should return value with only one parameter", () => {
    const returnAge = memofy((age: number) => age);
    expect(returnAge(15)).toEqual(15);
  });
});

describe("tests with caching", () => {
  const concatPhoneNumber = memofy(
    (_extension: number, _number: number): string => {
      return `${_extension}+${_number}`;
    }
  );
  beforeEach(() => {
    concatPhoneNumber(90, 5555552);
  });
  test("should return value from caching", () => {
    expect(concatPhoneNumber(90, 5555552)).toStrictEqual("90+5555552");
  });
});
