import FunctionCacheStore from "./store/FunctionCacheStore";
import DepsCacheStore from "./store/DepsCacheStore";

import { DepsType } from "./types/DepsType";
import { MemoizedFunctionType } from "./types/MemoizedFunctionType";
import InitializationConfigType from "./types/InitializationConfigType";

let functionCacheStore: InstanceType<typeof FunctionCacheStore>;
let depsCacheStore: InstanceType<typeof DepsCacheStore>;

const initMemofy = ({ trace = false }: InitializationConfigType = {}) => {
  functionCacheStore = new FunctionCacheStore();
  depsCacheStore = new DepsCacheStore();
  if (trace && typeof window !== "undefined") {
    window.__memofy__ = {
      functions: functionCacheStore.store,
      dependencies: depsCacheStore.store,
    };
    console.info("Injected memofy tracing to console as '__memofy__'");
  }
};

const memoize = <R = any>(
  functionToMemoize: MemoizedFunctionType<R, Array<any>>,
  deps: DepsType = [],
  context?: unknown
): MemoizedFunctionType<R, Parameters<typeof functionToMemoize>> => {
  return (
    ...args: Parameters<typeof functionToMemoize>
  ): ReturnType<typeof functionToMemoize> => {
    try {
      // IF IT HAS CACHE
      if (
        functionCacheStore.hasCache(functionToMemoize) &&
        !depsCacheStore.isChanged(functionToMemoize, deps)
      ) {
        const cachedResult = functionCacheStore.getCacheByArgs(
          functionToMemoize,
          args
        );

        if (cachedResult) return cachedResult as R;
      }

      // IF IT HASN'T ANY CACHE
      const result = functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        R
      >(context, args);

      if (args.length) functionCacheStore.set(functionToMemoize, args, result);

      // SET DEPENDENCY CACHE STORE FOR CONTROL CHANGE WHILE NEXT CALL
      if (deps.length) depsCacheStore.set(functionToMemoize, deps);

      return result as R;
    } catch (err: unknown) {
      console.error("memofy executing error", err);
      // RETURN PURE FUNCTION WHEN THROW ERROR
      return functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        R
      >(context, args);
    }
  };
};

export { initMemofy, memoize };
