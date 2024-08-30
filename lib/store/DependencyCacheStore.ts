import { deepClone, isDeepEqual } from "amigo-js";
import { type Deps } from "../types/deps.type";

class DependencyCacheStore<D extends Deps> {
  private readonly store: WeakMap<Function, D>;

  constructor() {
    this.store = new WeakMap<Function, D>();
  }

  set(_key: Function, _deps: D): void {
    this.store.set(_key, deepClone(_deps));
  }

  get(_key: Function): D | undefined {
    return this.store.get(_key);
  }
  
  isChanged(_key: Function, _deps: D): boolean {
    if (!_deps) return false;
    const deps = this.get(_key);
    if (!deps) return false;
    return _deps.some((_dep, index) => !isDeepEqual(deps[index], _dep));
  }
}

export default DependencyCacheStore;
