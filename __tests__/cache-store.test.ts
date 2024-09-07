import FunctionCacheStore from "../lib/store/FunctionCacheStore";
import { type Args } from "../lib/types/args.type";

describe("CacheStore Tests", () => {
  let functionCacheStore: FunctionCacheStore<Args, any>;
  beforeEach(() => {
    functionCacheStore = new FunctionCacheStore();
  });

  test("should set cacheStore with multiple parameters", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionCacheStore.set(
      sumTotal,
      paramArgs,
      sumTotal(paramArgs[0], paramArgs[1])
    );
    expect(functionCacheStore.getCacheByArgs(sumTotal, paramArgs)).toEqual(15);
  });

  test("should set cacheStore with one parameter", () => {
    let getAge;
    getAge = (a: { age: number }) => a.age;
    const paramArgs = [{ age: 24 }];
    functionCacheStore.set(getAge, paramArgs, getAge(paramArgs[0]));
    expect(functionCacheStore.getCacheByArgs(getAge, paramArgs)).toEqual(24);

    getAge = null;
    expect(functionCacheStore.hasCacheByFunction(getAge)).toBeFalsy();
  });

  test("should get cache", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    functionCacheStore.set(sumTotal, paramArgs, result);
    expect(
      functionCacheStore.getCacheByArgs(sumTotal, paramArgs)
    ).toBeDefined();
  });

  test("should control has cache", () => {
    let sumTotal;
    sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionCacheStore.set(
      sumTotal,
      paramArgs,
      sumTotal(paramArgs[0], sumTotal[1])
    );
    expect(functionCacheStore.hasCacheByFunction(sumTotal)).toBeTruthy();
    expect(
      functionCacheStore.getCacheByArgs(sumTotal, paramArgs)
    ).toBeDefined();

    sumTotal = function dummy() {};
    expect(functionCacheStore.hasCacheByFunction(sumTotal)).toBeFalsy();
  });
});
