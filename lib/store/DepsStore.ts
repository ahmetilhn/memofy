import stringifier from "../helpers/stringifier.helper";
import { type Deps } from "../types/deps.type";

class DepsStore<D extends Deps> {
  private readonly store: WeakMap<Function, D>;

  constructor() {
    this.store = new WeakMap<Function, D>();
  }

  set(_key: Function, _deps: D): void {
    this.store.set(_key, structuredClone(_deps));
  }

  get(_key: Function): D | undefined {
    return this.store.get(_key);
  }
  isChanged(_key: Function, _deps: D): boolean {
    const deps = this.get(_key);

    if (deps) {
      return _deps.some((_dep, index) => {
        return stringifier(deps[index]) !== stringifier(_dep);
      });
    }
    return false;
  }
}

export default DepsStore;
