import stringifier from "../helpers/stringifier.helper";
import { type Cache } from "../types/cache.type";
class CacheStore<C extends Cache> {
  private readonly store: WeakMap<Function, C>;

  constructor() {
    this.store = new WeakMap<Function, C>();
  }

  set(_key: Function, _args: Readonly<Array<any>>, _result: any): void {
    const val = new Map() as C;
    val.set(stringifier(_args), _result);
    this.store.set(_key, val);
  }

  get(_key: Function, _args: Readonly<Array<any>>): any {
    return this.store.get(_key)?.get(stringifier(_args));
  }

  isHasCache(_key: Function, _args: Readonly<Array<any>>): boolean {
    if (!this.store.has(_key)) return false;
    return !!this.get(_key, _args);
  }
}

export default CacheStore;
