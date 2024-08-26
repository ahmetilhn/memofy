const cacheStore = new WeakMap<Function, Map<string, any>>();

export default function memofy<ReturnType>(
  _functionToMemoize: Function,
  ..._deps: Array<any>
): Function {
  return (...args: Array<any>): ReturnType => {
    const cachedData: Map<any, any> | undefined =
      cacheStore.get(_functionToMemoize);

    if (typeof cachedData !== "undefined") {
      return cachedData.get(JSON.stringify(args));
    }

    const returnVal = _functionToMemoize(...args);

    const cacheContent: Map<any, any> = new Map();
    cacheContent.set(JSON.stringify(args), returnVal);
    cacheStore.set(_functionToMemoize, cacheContent);

    return returnVal;
  };
}
