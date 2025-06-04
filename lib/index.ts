import FunctionCacheStore from "./store/FunctionStore";
import DepsCacheStore from "./store/DependencyStore";

import { writeToConsole } from "./helpers/logger";
import MemoizedFunction from "./types/MemoizedFunction";
import { isBoolean, isClient } from "@ahmetilhn/handy-utils";
import MemofyParams from "./types/MemofyParams";

class Memofy {
  private readonly trace: boolean = false;
  private readonly hasLogs: boolean = false;
  private functionStore: InstanceType<typeof FunctionCacheStore> | undefined;
  private depsStore: InstanceType<typeof DepsCacheStore> | undefined;
  private wasInitialize: boolean = false;

  constructor(params: MemofyParams = {}) {
    if (isBoolean(params.trace)) this.trace = params.trace;
    if (isBoolean(params.hasLogs)) this.hasLogs = params.hasLogs;
    this.init();
  }

  init = (): void => {
    this.functionStore = new FunctionCacheStore();
    this.depsStore = new DepsCacheStore();

    if (this.trace && isClient()) {
      window.__memofy__ = {
        functions: this.functionStore.store,
        dependencies: this.depsStore.store,
      };

      console.info("Injected memofy tracing to console as '__memofy__'");
    }
    this.wasInitialize = true;
  };

  memoize = <F extends MemoizedFunction>(
    functionToMemoize: F,
    deps: Array<any> = [],
    context?: unknown
  ): F => {
    return ((...args: Parameters<F>): ReturnType<typeof functionToMemoize> => {
      if (!this.wasInitialize || !this.functionStore || !this.depsStore)
        return functionToMemoize.apply<
          typeof context,
          Parameters<typeof functionToMemoize>,
          ReturnType<F>
        >(context, args);

      if (
        this.functionStore.hasCache(functionToMemoize) &&
        !this.depsStore.hasChange(functionToMemoize, deps)
      ) {
        const cachedResult = this.functionStore.getCacheByArgs(
          functionToMemoize,
          args
        );

        if (cachedResult) {
          if (this.hasLogs)
            writeToConsole(functionToMemoize.name, cachedResult);

          return cachedResult as ReturnType<F>;
        }
      }

      const result = functionToMemoize.apply<
        typeof context,
        Parameters<typeof functionToMemoize>,
        ReturnType<F>
      >(context, args);

      if (args.length) this.functionStore.set(functionToMemoize, args, result);
      if (deps.length) this.depsStore.set(functionToMemoize, deps);

      return result;
    }) as ReturnType<typeof functionToMemoize>;
  };
}

export default Memofy;
