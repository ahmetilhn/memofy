import FunctionCacheStore from "./store/FunctionCacheStore";
import DependencyCacheStore from "./store/DependencyCacheStore";
import ArgumentCacheStore from "./store/ArgumentCacheStore";

import { type Args } from "./types/args.type";
import { type Deps } from "./types/deps.type";
import { type MemoizedFunction } from "./types/memoized-function.type";

const functionCacheStore = new FunctionCacheStore();
const dependencyCacheStore = new DependencyCacheStore();
const argumentCacheStore = new ArgumentCacheStore();

export default function memofy<A extends Args, ReturnType>(
  _functionToMemoize: (...args: Array<unknown>) => ReturnType,
  _deps: Deps = [],
  _context: unknown = undefined
): MemoizedFunction<A, ReturnType> {
  return (...args: A): ReturnType => {
    try {
      // IF IT HAVE CACHE
      if (
        functionCacheStore.isHasCache(_functionToMemoize) &&
        !dependencyCacheStore.isChanged(_functionToMemoize, _deps)
      ) {
        const cachedArgs = functionCacheStore.getCacheByArgs(
          _functionToMemoize,
          args
        );

        if (cachedArgs) {
          const cachedResult = argumentCacheStore.getCacheByKey(cachedArgs);
          if (cachedResult) return cachedResult;
        }
      }

      // IF IT HAVEN'T ANY CACHE
      const result = _functionToMemoize.apply(_context, args);
      // SET FUNCTION AND ARGUMENT CACHE STORE FOR REMEMBER RESULT NEXT CALLING

      if (args.length) {
        functionCacheStore.set(_functionToMemoize, args);
        argumentCacheStore.set(args, result);
      }

      // SET DEPENDENCY CACHE STORE FOR CONTROL CHANGE NEXT CALLING
      if (_deps.length > 0) dependencyCacheStore.set(_functionToMemoize, _deps);

      return result;
    } catch (err: unknown) {
      console.error("memofy executing error", err);
      // RETURN PURE FUNCTION WHEN THROW ERROR
      return _functionToMemoize.apply(_context, args);
    }
  };
}
