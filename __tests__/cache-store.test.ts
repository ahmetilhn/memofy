import FunctionStore from "../lib/store/FunctionStore";
import { Args } from "../lib/types/args.type";

describe("CacheStore Tests", () => {
  let functionStore: FunctionStore<Args>;
  beforeEach(() => {
    functionStore = new FunctionStore();
  });

  test("should set cacheStore with multiple parameters", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionStore.set(sumTotal, paramArgs);
    expect(functionStore.getCacheByArgs(sumTotal, paramArgs)).toStrictEqual(
      paramArgs
    );
  });

  test("should set cacheStore with one parameter", () => {
    let getAge;
    getAge = (a: { age: number }) => a.age;
    const paramArgs = [{ age: 24 }];
    functionStore.set(getAge, paramArgs);
    expect(functionStore.getCacheByArgs(getAge, paramArgs)).toStrictEqual(
      paramArgs
    );
  });

  test("should get cache", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    functionStore.set(sumTotal, paramArgs);
    expect(functionStore.getCacheByArgs(sumTotal, paramArgs)).toBeDefined();
  });

  test("should control has cache", () => {
    let sumTotal;
    sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionStore.set(sumTotal, paramArgs);
    expect(functionStore.isHasCacheByArgs(sumTotal, paramArgs)).toBeTruthy();

    sumTotal = function dummy() {};
    expect(functionStore.isHasCacheByArgs(sumTotal, paramArgs)).toBeFalsy();
  });
});
