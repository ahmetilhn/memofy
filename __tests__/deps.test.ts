import memofy from "../lib";
describe("Deps Tests", () => {
  const product = {
    price: 10,
  };
  const getPrice = jest.fn(() => product.price);
  const _getPrice = memofy(getPrice, [product]);
  beforeEach(() => {
    _getPrice();
  });
  test("should return from cache", () => {
    expect(_getPrice()).toBe(10);
    expect(_getPrice()).toBe(10);
    expect(_getPrice()).toBe(10);
    expect(_getPrice()).toBe(10);
    expect(getPrice).toHaveBeenCalledTimes(1);
  });

  test("should get from new calculating", () => {
    product.price = 20;
    expect(_getPrice()).toBe(20);
    expect(getPrice).toHaveBeenCalledTimes(2);

    product.price = 100;
    expect(_getPrice()).toBe(100);
    expect(getPrice).toHaveBeenCalledTimes(3);
  });
});
