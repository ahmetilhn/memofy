class DepsStore<T extends Array<any>> {
  private readonly store: WeakMap<Function, T>;

  constructor() {
    this.store = new WeakMap<Function, T>();
  }

  set(_key: Function, _deps: T): void {
    this.store.set(_key, structuredClone(_deps));
  }

  get(_key: Function): T | undefined {
    return this.store.get(_key);
  }
  isChanged(_key: Function, _deps: T): boolean {
    const deps = this.get(_key);
    if (deps) {
      return _deps.some((_dep, index) => {
        return JSON.stringify(deps[index]) !== JSON.stringify(_dep);
      });
    }
    return false;
  }
}

export default DepsStore;
