import DependencyStore from "../lib/store/DependencyStore";

describe("DependencyStore Tests", () => {
  let dependencyStore: DependencyStore<Array<any>>;

  beforeEach(() => {
    dependencyStore = new DependencyStore();
  });

  test("should set to dependencyStore", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    dependencyStore.set(getPrice, deps);
    expect(dependencyStore.get(getPrice)).toEqual(deps);
  });

  test("should return isChanged", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    dependencyStore.set(getPrice, deps);
    expect(dependencyStore.isChanged(getPrice, deps)).toBeFalsy();

    product.price = 30;
    expect(dependencyStore.isChanged(getPrice, deps)).toBeTruthy();
  });
});
