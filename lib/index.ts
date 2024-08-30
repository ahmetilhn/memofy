import { Args } from "./types/args.type";
import CacheStore from "./store/FunctionStore";
import DependencyStore from "./store/DependencyStore";
import { type Deps } from "./types/deps.type";
import { type MemoizedFunction } from "./types/memoized-function.type";
import ArgumentStore from "./store/ArgumentStore";

const functionStore = new CacheStore();
const dependencyStore = new DependencyStore();
const argumentStore = new ArgumentStore();
export default function memofy<A extends Args, ReturnType>(
  _functionToMemoize: Function,
  _deps: Deps = []
): MemoizedFunction<A, ReturnType> {
  return (...args: A): ReturnType => {
    try {
      const cachedArgs = functionStore.getCacheByArgs(_functionToMemoize, args);

      // IF HAVE ANY CACHE
      if (cachedArgs && !dependencyStore.isChanged(_functionToMemoize, _deps)) {
        const cachedResult = argumentStore.getCacheByKey(args);
        if (cachedResult) return cachedResult;
      }

      // IF DON'T HAVE ANY CACHE
      const result = _functionToMemoize(...args);
      // Set cacheStore for next calling
      if (args.length) {
        functionStore.set(_functionToMemoize, args);
        argumentStore.set(args, result);
      }

      // Set dependencyStore for next calling when deps changed
      if (_deps.length > 0) dependencyStore.set(_functionToMemoize, _deps);

      return result;
    } catch (err: unknown) {
      console.error("memofy execute error", err);
      return _functionToMemoize(...args);
    }
  };
}
