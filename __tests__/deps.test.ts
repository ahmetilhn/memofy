import memofy from "../lib";
describe("Dependencies Tests", () => {
  const product = {
    price: 10,
  };
  const getPrice = jest.fn((taxRatio: number = 10) => product.price * taxRatio);
  const _getPrice = memofy(getPrice, [product]);
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
    expect(getPrice).toHaveBeenCalledTimes(2);

    product.price = 100;
    expect(_getPrice()).toBe(1000);
    expect(getPrice).toHaveBeenCalledTimes(3);
  });
});
