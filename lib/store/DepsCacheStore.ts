import { deepClone, isDeepEqual } from "amigo-js";
import Deps from "../types/DepsType";

class DepsCacheStore<D extends Deps = Deps> {
  public readonly store: WeakMap<Function, D>;

  constructor() {
    this.store = new WeakMap<Function, D>();
  }

  set(key: Function, deps: D): void {
    this.store.set(key, deepClone(deps));
  }

  get(key: Function): D | undefined {
    return this.store.get(key);
  }

  isChanged(key: Function, depsParam: D): boolean {
    if (!depsParam) return false;
    const deps = this.get(key);
    if (!deps) return false;
    return depsParam.some((dep, index) => !isDeepEqual(deps[index], dep));
  }
}

export default DepsCacheStore;
