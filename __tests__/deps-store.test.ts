import DependencyCacheStore from "../lib/store/DependencyCacheStore";

describe("dependencyCacheStore Tests", () => {
  let dependencyCacheStore: DependencyCacheStore<Array<any>>;

  beforeEach(() => {
    dependencyCacheStore = new DependencyCacheStore();
  });

  test("should set to dependencyCacheStore", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    dependencyCacheStore.set(getPrice, deps);
    expect(dependencyCacheStore.get(getPrice)).toEqual(deps);
  });

  test("should return isChanged", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    dependencyCacheStore.set(getPrice, deps);
    expect(dependencyCacheStore.isChanged(getPrice, deps)).toBeFalsy();

    product.price = 30;
    expect(dependencyCacheStore.isChanged(getPrice, deps)).toBeTruthy();
  });
});
