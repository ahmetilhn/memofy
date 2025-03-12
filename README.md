# memofy 🚀 - Lightweight Memoization for JavaScript Functions (1.3KB)

### Cache mechanism(memoizer) for functions executed with the same parameters (Only 1.3 KB)

This project provides a memoize function for improving performance in JavaScript or TypeScript projects by caching the results of expensive function calls. By memoizing, repeated calls with the same arguments will return the cached result, speeding up execution.

This module works like react's useMemo hook but NOT required react. You can use any framework or pure javascript projects

<p align="center">
  <a href="https://www.npmjs.com/package/@ahmetilhn/memofy"><img alt="NPM" src="https://img.shields.io/npm/v/@ahmetilhn/memofy.svg" /></a>
  <a href="https://img.shields.io/npm/dy/@ahmetilhn/memofy"><img alt="NPM" src="https://img.shields.io/npm/dy/@ahmetilhn/memofy" /></a>
  <a href="https://github.com/transitive-bullshit/agentic/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
</p>

## Features

- **Function Memoization: Caches results of function calls with the same arguments.**
- **Dependency Tracking: Updates the cache if dependencies change.**
- **Flexibility: Usable in both JavaScript and TypeScript projects.**
- **The best solution for CPU-intensive operations or complex calculations**
- **The disconnected functions are deleted from memory. The caches belonging to this function are also deleted.**
- **WeakMap based cache store**
- **WeakMap Disconnects methods that cannot communicate with weak reference links and triggers the garbage collector to kick in**

## Why should we use memofy?

**Using Memofy you can reduce the execution time of your functions by up to 1500 times. The following results were obtained by testing on a heavy function.** 💪🏼

| Test Case                | Function Execute Time (ms) |
| ------------------------ | -------------------------- |
| **With Memofy (CACHED)** | 0.083 ms                   |
| **Without Memofy**       | 57.571 ms                  |

AND very easy

```js
import {memoize} from "memofy";

const dep1 = /** Variable to track change */

const heavyMethod = memoize((...args) => {
 // calculate something then return
}, [...deps]);

// heavyMethod looks at the deps and arguments every time it is called.
// If there is no change, it brings it from the cache. If there is a change, it runs the function again
```

## Installation

##### NPM

```bash
npm install memofy
```

##### YARN

```bash
yarn add memofy
```

## Initialization

_You should init memofy. It is provide initialization function and deps store. **This is important step**. It should trigger once your project lifecycle._

```js
import { initMemofy } from "memofy";
initMemofy();
/*If you want watch and debug memofy store on console pass this param */
initMemofy({ trace: true });
/*If you want see returned cached value from memofy pass this param */
initMemofy({ hasLogs: true });
```

## Usage case

### Without deps parameters

_In the following process, when the concatPhoneNumber method is called again with the same parameters, the function is not executed again, it fetches the result from the cache._

```js
import { memoize } from "memofy";

const concatPhoneNumber = (extension, number) => {
  // Heavy calculation
  // return result
};

const memoizedConcatPhoneNumber = memoize(concatPhoneNumber, []);

memoizedConcatPhoneNumber(90, 555); // Runs concatPhoneNumber once
memoizedConcatPhoneNumber(90, 555); // Don't run because fetched from cache (same parameter)
memoizedConcatPhoneNumber(90, 552); // Runs concatPhoneNumber because params is changed
```

### With deps parameter

_If you want the method to run again with the same parameter according to some dependencies, you can pass the deps parameter as follows._

```js
import { memoize } from "memofy";

const product = { title: "Test product", price: 10 };

const calculateTax = (taxRatio) => {
  // Calculate tax by product price
  // Heavy calculation
  return taxRatio * product.price;
};

const memoizedCalculateTax = memoize(calculateTax, [product]);

calculateTax(2); // Runs calculateTax when first run -> 20
calculateTax(2); // // Don't run because fetched from cache (same parameter and same deps) -> 20

product.price = 40;
calculateTax(3); // Runs calculateTax because product dep changed -> 120
```

```js
import { memoize } from "memofy";

const products = [
  /**Let's say there are more than 100 products */
];

// It is costly to cycle through 100 products each time. Just keep the result in the cache when it runs once.
const getTotalPrice = (fixPrice) => {
  return products.reduce((acc, curr) => acc + curr.price, 0);
};

const _getTotalPrice = memoize(getTotalPrice, [products]);
getTotalPrice(0); // Runs getTotalPrice once
getTotalPrice(0); // Don't run because fetched from cache
products.push({
  /** a few products */
});
getTotalPrice(2); // Runs again getTotalPrice because products and parameter changed
```

### With context

_If context(this, globalContex e.g) is used in the function you want to cache, you can pass the context parameter._

```js
import { memoize } from "memofy";

this.user.name = "Jack"; // For example inject name to context

const getName = (suffix) => {
  return `${suffix} ${this.user.name}`;
};
const memoizedGetName = memoize(getName, [], this);
memoizedGetName("Mr"); // Result is Mr Jack

this.user.name = "John";
memoizedGetName("Mr"); // Result is Mr John because context data changed
```

## Declaration for typescript

```ts
type DepsType = Array<any>;

type MemoizedFunctionType<R, P extends Array<any>> = (...args: P) => R;

type InitializationConfigType = {
  trace?: boolean;
  hasLogs?: boolean;
};

declare const initMemofy: ({
  trace,
  hasLogs,
}?: InitializationConfigType) => Promise<void>;
declare const memoize: <R = any>(
  functionToMemoize: MemoizedFunctionType<R, Array<any>>,
  deps?: DepsType,
  context?: unknown
) => MemoizedFunctionType<R, Parameters<typeof functionToMemoize>>;

export { initMemofy, memoize };
```

## Performance result

_Performance results on a complex function that distinguishes prime numbers. [Performance Test](https://github.com/ahmetilhn/memofy/blob/master/__tests__/performance.test.ts)_

| Case                               | ms         |
| ---------------------------------- | ---------- |
| First execute time (no caching)    | > 52.08 ms |
| Second execute time (caching)      | < 0.03 ms  |
| and subsequent execution (caching) | < 0.03 ms  |

## Test coverage result

_Tests were written for all cases and all parameter types. [Tests](https://github.com/ahmetilhn/memofy/tree/master/__tests__)_

| File                       | % Stmts | % Branch | % Funcs | % Lines |
| -------------------------- | ------- | -------- | ------- | ------- |
| All files                  | 90.69   | 86.95    | 100     | 94.59   |
| lib                        | 88.88   | 92.3     | 100     | 87.5    |
| index.ts                   | 88.88   | 92.3     | 100     | 87.5    |
| lib/store                  | 92      | 80       | 100     | 100     |
| DependencyCacheStore.ts.ts | 90      | 75       | 100     | 100     |
| FunctionCacheStore.ts      | 93.33   | 83.33    | 100     | 100     |

## Contributing

_This is open source software. If you want, you can support it by becoming a contributor._ [Github Repository](https://github.com/ahmetilhn/memofy)
