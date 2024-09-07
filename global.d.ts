declare namespace NodeJS {
  interface Global {
    user: {
      name: string;
    };
  }
}

interface Window {
  _memofy_: { functions: WeakMap; dependencies: WeakMap };
}
