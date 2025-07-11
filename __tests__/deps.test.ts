import Memofy from "../lib";

describe("deps tests", () => {
  const { memoize } = new Memofy();

  const product = {
    price: 10,
  };
  const getPrice = jest.fn((taxRatio: number = 10) => product.price * taxRatio);
  const _getPrice = memoize(getPrice, [product]);
  beforeEach(() => {
    _getPrice(10);
  });
  test("should return from cache", () => {
    expect(_getPrice(10)).toBe(100);
    expect(_getPrice(10)).toBe(100);
    expect(_getPrice(10)).toBe(100);
    expect(_getPrice(10)).toBe(100);
    expect(getPrice).toHaveBeenCalledTimes(1);
  });

  test("should get from new calculating", () => {
    product.price = 20;
    expect(_getPrice()).toBe(200);
    expect(getPrice).toHaveBeenCalledTimes(1);

    product.price = 100;
    expect(_getPrice()).toBe(1000);
    expect(getPrice).toHaveBeenCalledTimes(2);
  });
});
