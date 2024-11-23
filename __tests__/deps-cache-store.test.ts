import DepsCacheStore from "../lib/store/DepsCacheStore";

describe("dependencyCacheStore Tests", () => {
  let depsCacheStore: DepsCacheStore<Array<any>>;

  beforeEach(() => {
    depsCacheStore = new DepsCacheStore();
  });

  test("should set to dependencyCacheStore", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    depsCacheStore.set(getPrice, deps);
    expect(depsCacheStore.get(getPrice)).toEqual(deps);
  });

  test("should return isChanged", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    depsCacheStore.set(getPrice, deps);
    expect(depsCacheStore.isChanged(getPrice, deps)).toBeFalsy();

    product.price = 30;
    expect(depsCacheStore.isChanged(getPrice, deps)).toBeTruthy();
  });
});
