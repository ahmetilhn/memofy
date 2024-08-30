import { deepClone, isDeepEqual } from "amigo-js";
import { type Args } from "../types/args.type";
class FunctionStore<A extends Args> {
  private readonly store: WeakMap<Function, Array<A>>;

  constructor() {
    this.store = new WeakMap();
  }

  set(_key: Function, _args: A): void {
    if (!this.isHasCacheByArgs(_key, _args)) {
      this.store.get(_key)?.push(deepClone(_args));
    }
    this.store.set(_key, [deepClone(_args)]);
  }
  getCacheByArgs(_key: Function, _args: A): A | undefined {
    return this.store.get(_key)?.findLast((__args) => {
      return isDeepEqual(__args, _args);
    });
  }

  isHasCacheByArgs(_key: Function, _args: A): boolean {
    if (!this.store.has(_key)) return false;
    return !!this.getCacheByArgs(_key, _args);
  }
}

export default FunctionStore;
