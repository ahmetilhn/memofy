import DependencyStore from "../lib/store/DependencyStore";

describe("DependencyStore Tests", () => {
  let dependencyStore: InstanceType<typeof DependencyStore<Array<any>>>;

  beforeEach(() => {
    dependencyStore = new DependencyStore();
  });

  test("should set to dependencyCacheStore", () => {
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
    expect(dependencyStore.hasChange(getPrice, deps)).toBeFalsy();

    product.price = 30;
    expect(dependencyStore.hasChange(getPrice, deps)).toBeTruthy();
  });
});
