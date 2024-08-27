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

    const stringifiedArgs = JSON.stringify(args);

    if (cachedData?.get(stringifiedArgs)) {
      return cachedData.get(stringifiedArgs);
    }

    const returnVal = _functionToMemoize(...args);

    const cacheContent: Map<any, any> = new Map();
    cacheContent.set(stringifiedArgs, returnVal);
    cacheStore.set(_functionToMemoize, cacheContent);

    return returnVal;
  };
}
