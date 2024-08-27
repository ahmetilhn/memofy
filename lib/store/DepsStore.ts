class DepsStore<CacheContent extends Array<any>> {
  private readonly store: WeakMap<Function, CacheContent>;

  constructor() {
    this.store = new WeakMap<Function, CacheContent>();
  }

  set(_key: Function, _deps: CacheContent): void {
    this.store.set(_key, structuredClone(_deps));
  }

  get(_key: Function): CacheContent | undefined {
    return this.store.get(_key);
  }
  isChanged(_key: Function, _deps: CacheContent): boolean {
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
