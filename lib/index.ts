import CacheStore from "./store/CacheStore";
import DepsStore from "./store/DepsStore";

type MemoizedFunction<Args extends Array<any>, ReturnType> = (
  ...args: Args
) => ReturnType;

export default function memofy<Args extends Array<any>, ReturnType>(
  _functionToMemoize: Function,
  _deps: Array<any> = []
): MemoizedFunction<Args, ReturnType> {
  const cacheStore = new CacheStore();
  const depsStore = new DepsStore();

  return (...args: Args): ReturnType => {
    if (
      cacheStore.isHasCache(_functionToMemoize, args) &&
      !depsStore.isChanged(_functionToMemoize, _deps)
    ) {
      return cacheStore.get(_functionToMemoize, args) as ReturnType;
    }

    const result = _functionToMemoize(...args);

    // Set cacheStore for next calling
    const cacheContent: Map<string, any> = new Map();
    cacheContent.set(JSON.stringify(args), result);
    cacheStore.set(_functionToMemoize, cacheContent);

    if (_deps.length > 0) {
      // Set depsStore for next calling when deps changed
      depsStore.set(_functionToMemoize, _deps);
    }
    return result;
  };
}
