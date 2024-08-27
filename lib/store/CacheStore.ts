class CacheStore {
  private store: WeakMap<Function, Map<string, any>>;

  constructor() {
    this.store = new WeakMap<Function, Map<string, any>>();
  }

  set(_key: Function, _val: Map<string, any>): void {
    this.store.set(_key, _val);
  }

  get(_key: Function, _args: Array<any>): Map<string, any> | undefined {
    return this.store.get(_key)?.get(JSON.stringify(_args));
  }

  isHasCache(_key: Function, _args: Array<any>): boolean {
    if (!this.store.has(_key)) return false;
    return !!this.get(_key, _args);
  }
}

export default CacheStore;
