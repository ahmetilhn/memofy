import FunctionCacheStore from "./store/FunctionCacheStore";
import DependencyCacheStore from "./store/DependencyCacheStore";

import { type Args } from "./types/args.type";
import { type Deps } from "./types/deps.type";
import { type MemoizedFunction } from "./types/memoized-function.type";

const functionCacheStore = new FunctionCacheStore();
const dependencyCacheStore = new DependencyCacheStore();

export default function memofy<A extends Args, ReturnType extends any>(
  _functionToMemoize: (...args: Array<unknown>) => ReturnType,
  _deps: Deps = [],
  _context?: unknown
): MemoizedFunction<A, ReturnType> {
  return (..._args: A): ReturnType => {
    try {
      // IF IT HAS CACHE
      if (
        functionCacheStore.hasCacheByFunction(_functionToMemoize) &&
        !dependencyCacheStore.isChanged(_functionToMemoize, _deps)
      ) {
        const cachedResult = functionCacheStore.getCacheByArgs(
          _functionToMemoize,
          _args
        );

        if (cachedResult) return cachedResult as ReturnType;
      }

      // IF IT HASN'T ANY CACHE
      const result = _functionToMemoize.apply(_context, _args);

      if (_args.length) {
        functionCacheStore.set(_functionToMemoize, _args, result);
      }

      // SET DEPENDENCY CACHE STORE FOR CONTROL CHANGE NEXT CALLING
      if (_deps.length > 0) dependencyCacheStore.set(_functionToMemoize, _deps);

      return result;
    } catch (err: unknown) {
      console.error("memofy executing error", err);

      // RETURN PURE FUNCTION WHEN THROW ERROR
      return _functionToMemoize.apply(_context, _args);
    }
  };
}
