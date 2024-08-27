import DepsStore from "../lib/store/DepsStore";

describe("DepsStore Tests", () => {
  let depsStore: DepsStore<Array<any>>;

  beforeEach(() => {
    depsStore = new DepsStore();
  });

  test("should set to depsStore", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    depsStore.set(getPrice, deps);
    expect(depsStore.get(getPrice)).toEqual(deps);
  });

  test("should return isChanged", () => {
    const product = { price: 10 };
    const getPrice = () => product.price;
    const deps = [product];
    depsStore.set(getPrice, deps);
    expect(depsStore.isChanged(getPrice, deps)).toBeFalsy();

    product.price = 30;
    expect(depsStore.isChanged(getPrice, deps)).toBeTruthy();
  });
});
