import CacheStore from "./store/CacheStore";
import DepsStore from "./store/DepsStore";
import { type Deps } from "./types/deps.type";
import { type MemoizedFunction } from "./types/memoized-function.type";

export default function memofy<Args extends Readonly<Array<any>>, ReturnType>(
  _functionToMemoize: Function,
  _deps: Deps = []
): MemoizedFunction<Args, ReturnType> {
  const cacheStore = new CacheStore();
  const depsStore = new DepsStore();

  return (...args: Args): ReturnType => {
    try {
      if (
        cacheStore.isHasCache(_functionToMemoize, args) &&
        !depsStore.isChanged(_functionToMemoize, _deps)
      ) {
        return cacheStore.get(_functionToMemoize, args) as ReturnType;
      }
      const result = _functionToMemoize(...args);

      // Set cacheStore for next calling
      cacheStore.set(_functionToMemoize, args, result);

      // Set depsStore for next calling when deps changed
      if (_deps.length > 0) depsStore.set(_functionToMemoize, _deps);

      return result;
    } catch (err: unknown) {
      console.error("memofy execute error", err);
      return _functionToMemoize(...args);
    }
  };
}
