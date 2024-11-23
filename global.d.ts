declare namespace NodeJS {
  interface Global {
    user: {
      name: string;
    };
  }
}

interface Window {
  __memofy__: { functions: WeakMap; dependencies: WeakMap };
}
