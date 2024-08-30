import { deepClone, isDeepEqual } from "amigo-js";
import { type Args } from "../types/args.type";
class FunctionCacheStore<A extends Args> {
  private readonly store: WeakMap<Function, Array<A>>;

  constructor() {
    this.store = new WeakMap();
  }

  set(_key: Function, _args: A): void {
    if (this.isHasCache(_key)) {
      this.store.get(_key)?.push(deepClone(_args));
      return;
    }
    this.store.set(_key, [deepClone(_args)]);
  }

  getCacheByArgs(_key: Function, _args: A): A | undefined {
    return this.store
      .get(_key)
      ?.findLast((__args) => isDeepEqual(__args, _args));
  }

  isHasCache(_key: Function): boolean {
    return this.store.has(_key);
  }
}

export default FunctionCacheStore;
