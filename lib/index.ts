const cacheStore = new WeakMap<Function, Map<string, any>>();

export default function memofy<ReturnType>(
  _functionToMemoize: Function,
  ..._deps: Array<any>
): (..._functionToMemoizeArgs: Array<any>) => ReturnType {
  if (typeof _functionToMemoize !== "function")
    throw new Error("functionToMemoize must be function");
  return (...args: Array<any>): ReturnType => {
    const cachedData: Map<any, any> | undefined =
      cacheStore.get(_functionToMemoize);

    if (cachedData?.get(JSON.stringify(args))) {
      return cachedData.get(JSON.stringify(args));
    }

    const returnVal = _functionToMemoize(...args);

    const cacheContent: Map<any, any> = new Map();
    cacheContent.set(JSON.stringify(args), returnVal);
    cacheStore.set(_functionToMemoize, cacheContent);

    return returnVal;
  };
}
