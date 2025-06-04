import { deepClone, isDeepEqual } from "@ahmetilhn/handy-utils";

class DependencyStore<D extends Array<any> = Array<any>> {
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

  hasChange(key: Function, depsParam: D): boolean {
    if (!depsParam) return false;
    const deps = this.get(key);
    if (!deps) return false;
    return depsParam.some((dep, index) => !isDeepEqual(deps[index], dep));
  }
}

export default DependencyStore;
