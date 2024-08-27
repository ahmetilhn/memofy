import memofy from "../lib";
describe("Caching Tests", () => {
  const concatPhoneNumber = jest.fn(
    (_extension: number, _number: number): string => {
      return `${_extension}+${_number}`;
    }
  );
  const _concatPhoneNumber = memofy(concatPhoneNumber);
  beforeEach(() => {
    _concatPhoneNumber(90, 5555552);
  });
  test("should return value from caching", () => {
    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1);

    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1); // Because value returned from cache
  });

  test("should return value from caching and it has been called once", () => {
    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1); // Because value returned from cache
  });

  test("should return value from caching and it has been called once", () => {
    expect(_concatPhoneNumber(90, 5555553)).toEqual("90+5555553");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(2);
  });
});
