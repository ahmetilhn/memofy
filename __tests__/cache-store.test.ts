import CacheStore from "../lib/store/CacheStore";

describe("CacheStore Tests", () => {
  let cacheStore: CacheStore<Map<string, any>>;
  beforeEach(() => {
    cacheStore = new CacheStore();
  });

  test("should set cacheStore with multiple parameters", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const cacheContent = new Map();
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    cacheContent.set(JSON.stringify(paramArgs), result);
    cacheStore.set(sumTotal, cacheContent);
    expect(cacheStore.get(sumTotal, paramArgs)).toBe(15);
  });

  test("should set cacheStore with one parameter", () => {
    let getAge;
    getAge = (a: { age: number }) => a.age;
    const paramArgs = [{ age: 24 }];
    const cacheContent = new Map();
    const result = getAge(paramArgs[0]);
    cacheContent.set(JSON.stringify(paramArgs), result);
    cacheStore.set(getAge, cacheContent);
    expect(cacheStore.get(getAge, paramArgs)).toBe(24);
  });

  test("should get cache", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const cacheContent = new Map();
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    cacheContent.set(JSON.stringify(paramArgs), result);
    cacheStore.set(sumTotal, cacheContent);
    expect(cacheStore.get(sumTotal, paramArgs)).toBeDefined();
  });

  test("should control has cache", () => {
    let sumTotal;
    sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const cacheContent = new Map();
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    cacheContent.set(JSON.stringify(paramArgs), result);
    cacheStore.set(sumTotal, cacheContent);
    expect(cacheStore.isHasCache(sumTotal, paramArgs)).toBeTruthy();

    sumTotal = function dummy() {};
    expect(cacheStore.isHasCache(sumTotal, paramArgs)).toBeFalsy();
  });
});
