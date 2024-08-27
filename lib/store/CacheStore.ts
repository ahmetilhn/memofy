class CacheStore<T extends Map<string, any>> {
  private store: WeakMap<Function, T>;

  constructor() {
    this.store = new WeakMap<Function, T>();
  }

  set(_key: Function, _val: T): void {
    this.store.set(_key, _val);
  }

  get(_key: Function, _args: Array<any>): any {
    return this.store.get(_key)?.get(JSON.stringify(_args));
  }

  isHasCache(_key: Function, _args: Array<any>): boolean {
    if (!this.store.has(_key)) return false;
    return !!this.get(_key, _args);
  }
}

export default CacheStore;
