import { deepClone, isDeepEqual } from "amigo-js";
import { Args } from "../types/args.type";

class ArgumentCacheStore<A extends Args> {
  private readonly store = new Map<A, any>();
  constructor() {
    this.store = new Map();
  }

  getCacheByKey(_args: A): any {
    return [...this.store.entries()].find(([__args, _result]) =>
      isDeepEqual(_args, __args)
    )?.[1];
  }

  set(_args: A, _result: any) {
    return this.store.set(deepClone(_args), _result);
  }
}

export default ArgumentCacheStore;
