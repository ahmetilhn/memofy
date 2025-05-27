import FunctionCacheStore from "./store/FunctionCacheStore";
import DepsCacheStore from "./store/DepsCacheStore";

import Deps from "./types/DepsType";
import InitializationConfig from "./types/InitializationConfig";
import { writeToConsole } from "./helpers/logger";
import MemoizedFunction from "./types/MemoizedFunction";
import { isClient } from "amigo-js";

let functionCacheStore: InstanceType<typeof FunctionCacheStore>;
let depsCacheStore: InstanceType<typeof DepsCacheStore>;

let hasCachedResultLog = false;
let isMemofyInitialize = false;

const initMemofy = async ({
  trace = false,
  hasLogs = false,
}: InitializationConfig = {}) => {
  functionCacheStore = new FunctionCacheStore();
  depsCacheStore = new DepsCacheStore();
  hasCachedResultLog = hasLogs;

  if (trace && isClient()) {
    window.__memofy__ = {
      functions: functionCacheStore.store,
      dependencies: depsCacheStore.store,
    };

    console.info("Injected memofy tracing to console as '__memofy__'");
  }
  isMemofyInitialize = true;
};

const memoize = <F extends MemoizedFunction>(
  functionToMemoize: F,
  deps: Deps = [],
  context?: unknown
): F => {
  return ((...args: Parameters<F>): ReturnType<typeof functionToMemoize> => {
    if (!isMemofyInitialize)
      return functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        ReturnType<F>
      >(context, args);

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

        return cachedResult as ReturnType<F>;
      }
    }

    const result = functionToMemoize.apply<
      typeof context,
      Parameters<typeof functionToMemoize>,
      ReturnType<F>
    >(context, args);

    if (args.length) functionCacheStore.set(functionToMemoize, args, result);
    if (deps.length) depsCacheStore.set(functionToMemoize, deps);

    return result;
  }) as ReturnType<typeof functionToMemoize>;
};

export { initMemofy, memoize };
