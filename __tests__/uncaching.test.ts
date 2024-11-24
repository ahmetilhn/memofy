import { initMemofy, memoize } from "../lib";
initMemofy();
describe("Without Caching Tests", () => {
  test("should return value with params", () => {
    const concatPhoneNumber = jest.fn(
      (_extension: number, _number: number): string => {
        return `${_extension}+${_number}`;
      }
    );
    const _concatPhoneNumber = memoize(concatPhoneNumber);
    expect(_concatPhoneNumber(90, 5555551)).toStrictEqual("90+5555551");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1);
  });

  test("should return value without params", () => {
    const returnName = jest.fn(() => "Jack");
    const _returnName = memoize(returnName);
    expect(_returnName()).toStrictEqual("Jack");
    expect(_returnName()).toStrictEqual("Jack");
    expect(returnName).toHaveBeenCalledTimes(2);
  });

  test("should return value with multiply parameters", () => {
    const sumNumbers = jest.fn(
      (a: number, b: number, c: number, d: number, e: number) =>
        a + b + c + d + e
    );
    const _sumNumbers = memoize(sumNumbers);
    expect(_sumNumbers(1, 2, 3, 4, 5)).toEqual(15);
    expect(sumNumbers).toHaveBeenCalledTimes(1);
  });

  test("should return value with only one parameter", () => {
    const returnAge = jest.fn((age: number) => age);
    const _returnAge = memoize(returnAge);
    expect(_returnAge(15)).toEqual(15);
    expect(returnAge).toHaveBeenCalledTimes(1);
  });

  test("should return value when called multiple different params", () => {
    const areaCalc = jest.fn((width: number, height: number) => width * height);
    const _areaCalc = memoize(areaCalc);

    expect(_areaCalc(1, 2)).toEqual(2);
    expect(areaCalc).toHaveBeenCalledTimes(1);

    expect(_areaCalc(2, 5)).toEqual(10);
    expect(areaCalc).toHaveBeenCalledTimes(2);

    expect(_areaCalc(100000, 100)).toEqual(10000000);
    expect(areaCalc).toHaveBeenCalledTimes(3);

    expect(_areaCalc(NaN, 1)).toEqual(NaN);
    expect(areaCalc).toHaveBeenCalledTimes(4);
  });

  test("should return value when passing obj params", () => {
    const getLabel = jest.fn((_product: { price: number; name: string }) => {
      return (
        _product.name +
        " - " +
        (_product.price * 900).toLocaleString().concat("$")
      );
    });
    const _getLabel = memoize(getLabel);
    expect(_getLabel({ price: 10, name: "Apple" })).toEqual("Apple - 9.000$");
    expect(getLabel).toHaveBeenCalledTimes(1);

    expect(_getLabel({ price: 1000, name: "Orange" })).toEqual(
      "Orange - 900.000$"
    );
    expect(getLabel).toHaveBeenCalledTimes(2);
  });
  test("should execute correctly", () => {
    const replaceTurkishChars = jest.fn((text: string): string => {
      return text
        .replace(/Ğ/gim, "G")
        .replace(/Ü/gim, "U")
        .replace(/Ş/gim, "S")
        .replace(/İ/gim, "I")
        .replace(/Ö/gim, "O")
        .replace(/Ç/gim, "C")
        .replace(/ğ/gim, "g")
        .replace(/ü/gim, "u")
        .replace(/ş/gim, "s")
        .replace(/ı/gim, "i")
        .replace(/ö/gim, "o")
        .replace(/ç/gim, "c");
    });
    const _replaceTurkishChars = memoize(replaceTurkishChars, []);
    expect(_replaceTurkishChars("ŞĞĞŞĞĞÇŞİİİÇÇÇÇ")).toBe("SGGSGGCSIIICCCC");
    expect(_replaceTurkishChars("ŞĞĞŞĞĞÇŞİİİÇÇÇÇ")).toBe("SGGSGGCSIIICCCC");
    expect(replaceTurkishChars).toHaveBeenCalledTimes(1);
    expect(_replaceTurkishChars("İÇÇÇÇ")).toBe("ICCCC");
    expect(replaceTurkishChars).toHaveBeenCalledTimes(2);

    const searchText = jest.fn((text: string, scanQuery: string) => {
      if (typeof text !== "string") text = String(text);
      text = replaceTurkishChars(text).toLowerCase();
      scanQuery = replaceTurkishChars(scanQuery).toLowerCase();
      return text.includes(scanQuery);
    });
    const _searchText = memoize(searchText, []);

    expect(_searchText("this is test subject", "test")).toBeTruthy();
    expect(replaceTurkishChars).toHaveBeenCalledTimes(4);
    expect(_searchText("this is test subject", "test")).toBeTruthy();
    expect(searchText).toHaveBeenCalledTimes(1);
    expect(replaceTurkishChars).toHaveBeenCalledTimes(4);
    expect(_searchText("this is test", "test")).toBeTruthy();
    expect(searchText).toHaveBeenCalledTimes(2);
    expect(replaceTurkishChars).toHaveBeenCalledTimes(6);
  });

  test("should work correctly while the method used the window object inside", () => {
    const getAuthIsReady = jest.fn(() => {
      const authKey = window.localStorage.getItem("auth");
      return !!authKey;
    });
    const _getStorageData = memoize(getAuthIsReady, []);
    expect(_getStorageData()).toBeFalsy();
  });

  test("should return correct result when passed function used context", () => {
    const context = { name: "John" };

    const getName = jest.fn(function (suffix: string) {
      return `${suffix} ${this.name}`;
    });
    const memoizedGetName = memoize(getName, [], context);
    expect(memoizedGetName("Mr")).toBe("Mr John");
    expect(memoizedGetName("Ms")).toBe("Ms John");
  });
});
