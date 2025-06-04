import FunctionStore from "../lib/store/FunctionStore";

describe("FunctionStore Tests", () => {
  let functionStore: InstanceType<typeof FunctionStore>;
  beforeEach(() => {
    functionStore = new FunctionStore();
  });

  test("should set cacheStore with multiple parameters", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionStore.set(
      sumTotal,
      paramArgs,
      sumTotal(paramArgs[0], paramArgs[1])
    );
    expect(functionStore.getCacheByArgs(sumTotal, paramArgs)).toEqual(15);
  });

  test("should set cacheStore with one parameter", () => {
    let getAge;
    getAge = (a: { age: number }) => a.age;
    const paramArgs = [{ age: 24 }];
    functionStore.set(getAge, paramArgs, getAge(paramArgs[0]));
    expect(functionStore.getCacheByArgs(getAge, paramArgs)).toEqual(24);

    getAge = null;
    expect(functionStore.hasCache(getAge)).toBeFalsy();
  });

  test("should get cache", () => {
    const sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    const result = sumTotal(paramArgs[0], paramArgs[1]);
    functionStore.set(sumTotal, paramArgs, result);
    expect(functionStore.getCacheByArgs(sumTotal, paramArgs)).toBeDefined();
  });

  test("should control has cache", () => {
    let sumTotal;
    sumTotal = (a: number, b: number) => a + b;
    const paramArgs = [10, 5];
    functionStore.set(sumTotal, paramArgs, sumTotal(paramArgs[0], sumTotal[1]));
    expect(functionStore.hasCache(sumTotal)).toBeTruthy();
    expect(functionStore.getCacheByArgs(sumTotal, paramArgs)).toBeDefined();

    sumTotal = function dummy() {};
    expect(functionStore.hasCache(sumTotal)).toBeFalsy();
  });
});
