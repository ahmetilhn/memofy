import { deepClone, isDeepEqual } from "amigo-js";

class FunctionCacheStore<A extends Array<any> = Array<any>> {
  public readonly store: WeakMap<Function, Map<A, any>>;

  constructor() {
    this.store = new WeakMap();
  }

  set(key: Function, args: A, result: any): void {
    if (this.hasCache(key)) {
      this.store.get(key)?.set(deepClone(args), result);
      return;
    }
    const cacheEntry = new Map();
    cacheEntry.set(deepClone(args), result);
    this.store.set(key, cacheEntry);
  }

  getCacheByArgs(key: Function, args: A): any | undefined {
    const cachedFunc = this.store.get(key);
    if (!cachedFunc) return undefined;
    for (const [cachedArgs, result] of cachedFunc.entries()) {
      if (isDeepEqual(cachedArgs, args)) {
        return result;
      }
    }
    return undefined;
  }
  hasCache(key: Function): boolean {
    return this.store.has(key);
  }
}

export default FunctionCacheStore;
