import { deepClone, isDeepEqual } from "amigo-js";
import { type Args } from "../types/args.type";
class FunctionCacheStore<A extends Args, R extends any> {
  public readonly store: WeakMap<Function, Map<A, any>>;

  constructor() {
    this.store = new WeakMap();
  }

  set(key: Function, args: A, result: any): void {
    if (this.hasCacheByFunction(key)) {
      this.store.get(key)?.set(deepClone(args), result);
      return;
    }
    const cacheEntry = new Map();
    cacheEntry.set(deepClone(args), result);
    this.store.set(key, cacheEntry);
  }

  getCacheByArgs(key: Function, args: A): R | undefined {
    const cachedFunc = this.store.get(key);
    if (!cachedFunc) return undefined;
    for (const [cachedArgs, result] of cachedFunc.entries()) {
      if (isDeepEqual(cachedArgs, args)) {
        return result;
      }
    }
    return undefined;
  }
  hasCacheByFunction(key: Function): boolean {
    return this.store.has(key);
  }
}

export default FunctionCacheStore;
