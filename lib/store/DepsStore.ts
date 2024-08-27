class DepsStore {
  private store: WeakMap<Function, Array<any>>;

  constructor() {
    this.store = new WeakMap<Function, Array<any>>();
  }

  set(_key: Function, _val: Array<any>): void {
    this.store.set(_key, structuredClone(_val));
  }

  get(_key: Function): Array<any> | undefined {
    return this.store.get(_key);
  }
  isChanged(_key: Function, _deps: Array<any>): boolean {
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
