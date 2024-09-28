import FunctionCacheStore from "./store/FunctionCacheStore";
import DependencyCacheStore from "./store/DependencyCacheStore";

import { type Args } from "./types/args.type";
import { type Deps } from "./types/deps.type";
import { type MemoizedFunction } from "./types/memoized-function.type";

const functionCacheStore = new FunctionCacheStore();
const dependencyCacheStore = new DependencyCacheStore();
if (typeof window !== "undefined") {
  window._memofy_ = {
    functions: functionCacheStore.store,
    dependencies: dependencyCacheStore.store,
  };
}

export default function memofy<R = any, P = any>(
  functionToMemoize: MemoizedFunction<R, P>,
  deps: Deps = [],
  context?: unknown
): MemoizedFunction<R, P> {
  return (...args: Args<P>): R => {
    try {
      // IF IT HAS CACHE
      if (
        functionCacheStore.hasCacheByFunction(functionToMemoize) &&
        !dependencyCacheStore.isChanged(functionToMemoize, deps)
      ) {
        const cachedResult = functionCacheStore.getCacheByArgs(
          functionToMemoize,
          args
        );

        if (cachedResult) return cachedResult as R;
      }

      // IF IT HASN'T ANY CACHE
      const result = functionToMemoize.apply<unknown, Array<P>, R>(
        context,
        args
      );

      if (args.length) {
        functionCacheStore.set(functionToMemoize, args, result);
      }

      // SET DEPENDENCY CACHE STORE FOR CONTROL CHANGE NEXT CALLING
      if (deps.length > 0) dependencyCacheStore.set(functionToMemoize, deps);

      return result as R;
    } catch (err: unknown) {
      console.error("memofy executing error", err);

      // RETURN PURE FUNCTION WHEN THROW ERROR
      return functionToMemoize.apply<unknown, Array<P>, R>(context, args);
    }
  };
}
