import FunctionCacheStore from "../lib/store/FunctionCacheStore";
import { Args } from "../lib/types/args.type";

describe("CacheStore Tests", () => {
  let functionCacheStore: FunctionCacheStore<Args>;
  beforeEach(() => {
    functionCacheStore = new FunctionCacheStore();
  });

  test("should set cacheStore with multiple parameters", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionCacheStore.set(sumTotal, paramArgs);
    expect(
      functionCacheStore.getCacheByArgs(sumTotal, paramArgs)
    ).toStrictEqual(paramArgs);
  });

  test("should set cacheStore with one parameter", () => {
    let getAge;
    getAge = (a: { age: number }) => a.age;
    const paramArgs = [{ age: 24 }];
    functionCacheStore.set(getAge, paramArgs);
    expect(functionCacheStore.getCacheByArgs(getAge, paramArgs)).toStrictEqual(
      paramArgs
    );
  });

  test("should get cache", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    functionCacheStore.set(sumTotal, paramArgs);
    expect(
      functionCacheStore.getCacheByArgs(sumTotal, paramArgs)
    ).toBeDefined();
  });

  test("should control has cache", () => {
    let sumTotal;
    sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionCacheStore.set(sumTotal, paramArgs);
    expect(functionCacheStore.isHasCache(sumTotal)).toBeTruthy();

    sumTotal = function dummy() {};
    expect(functionCacheStore.isHasCache(sumTotal)).toBeFalsy();
  });
});
