import { deepClone, isDeepEqual } from "amigo-js";
import { type Args } from "../types/args.type";
class FunctionCacheStore<A extends Args, R extends any> {
  public readonly store: WeakMap<Function, Map<A, any>>;

  constructor() {
    this.store = new WeakMap();
  }

  set(_key: Function, _args: A, _result: any): void {
    if (this.hasCacheByFunction(_key)) {
      this.store.get(_key)?.set(deepClone(_args), _result);
      return;
    }
    const cacheEntry = new Map();
    cacheEntry.set(deepClone(_args), _result);
    this.store.set(_key, cacheEntry);
  }

  getCacheByArgs(_key: Function, _args: A): R | undefined {
    const cachedFunc = this.store.get(_key);
    if (!cachedFunc) return undefined;
    for (const [cachedArgs, result] of cachedFunc.entries()) {
      if (isDeepEqual(cachedArgs, _args)) {
        return result;
      }
    }
    return undefined;
  }
  hasCacheByFunction(_key: Function): boolean {
    return this.store.has(_key);
  }
}

export default FunctionCacheStore;
