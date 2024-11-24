import FunctionCacheStore from "./store/FunctionCacheStore";
import DepsCacheStore from "./store/DepsCacheStore";

import { DepsType } from "./types/DepsType";
import { MemoizedFunctionType } from "./types/MemoizedFunctionType";
import InitializationConfigType from "./types/InitializationConfigType";
import { writeToConsole } from "./helpers/logger";

let functionCacheStore: InstanceType<typeof FunctionCacheStore>;
let depsCacheStore: InstanceType<typeof DepsCacheStore>;

let hasCachedResultLog = false;
let isMemofyInitialize = false;
const initMemofy = async ({
  trace = false,
  hasLogs = false,
}: InitializationConfigType = {}) => {
  functionCacheStore = new FunctionCacheStore();
  depsCacheStore = new DepsCacheStore();
  hasCachedResultLog = hasLogs;
  if (trace && typeof window !== "undefined") {
    window.__memofy__ = {
      functions: functionCacheStore.store,
      dependencies: depsCacheStore.store,
    };
    console.info("Injected memofy tracing to console as '__memofy__'");
  }
  isMemofyInitialize = true;
};

const memoize = <R = any>(
  functionToMemoize: MemoizedFunctionType<R, Array<any>>,
  deps: DepsType = [],
  context?: unknown
): MemoizedFunctionType<R, Parameters<typeof functionToMemoize>> => {
  return (
    ...args: Parameters<typeof functionToMemoize>
  ): ReturnType<typeof functionToMemoize> => {
    if (!isMemofyInitialize)
      return functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        R
      >(context, args);

    try {
      if (
        functionCacheStore.hasCache(functionToMemoize) &&
        !depsCacheStore.isChanged(functionToMemoize, deps)
      ) {
        const cachedResult = functionCacheStore.getCacheByArgs(
          functionToMemoize,
          args
        );

        if (cachedResult) {
          if (hasCachedResultLog)
            writeToConsole(functionToMemoize.name, cachedResult);

          return cachedResult as R;
        }
      }

      const result = functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        R
      >(context, args);

      if (args.length) functionCacheStore.set(functionToMemoize, args, result);
      if (deps.length) depsCacheStore.set(functionToMemoize, deps);

      return result as R;
    } catch (err: unknown) {
      console.error("memofy executing error", err);

      return functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        R
      >(context, args);
    }
  };
};

export { initMemofy, memoize };
