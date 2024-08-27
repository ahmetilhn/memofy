import CacheStore from "./store/CacheStore";
export default function memofy<ReturnType>(
  _functionToMemoize: Function,
  _deps?: Array<any>
): (..._functionToMemoizeArgs: Array<any>) => ReturnType {
  if (typeof _functionToMemoize !== "function")
    throw new Error("functionToMemoize must be function");
  const cacheStore = new CacheStore();
  return (...args: Array<any>): ReturnType => {
    if (cacheStore.isHasCache(_functionToMemoize, args)) {
      return cacheStore.get(_functionToMemoize, args) as ReturnType;
    }

    const result = _functionToMemoize(...args);

    // Set to cacheStore for next calling
    const cacheContent: Map<any, any> = new Map();
    cacheContent.set(JSON.stringify(args), result);
    cacheStore.set(_functionToMemoize, cacheContent);

    return result;
  };
}
