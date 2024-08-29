# memofy 🚀

### Cache mechanism(memoizer) for functions executed with the same parameters (Only 1.3 KB)

This project provides a memoize function for improving performance in JavaScript or TypeScript projects by caching the results of expensive function calls. By memoizing, repeated calls with the same arguments will return the cached result, speeding up execution.

This module works like react's useMemo hook but NOT required react. You can use any framework or pure javascript projects

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

| Test Case                  | Function Execute Time (ms) |
| -------------------------- | -------------------------- |
| **With Memofy (UNCACHED)** | 50.65 ms                   |
| **With Memofy (CACHED)**   | 0.031 ms                   |
| **Without Memofy**         | 57.571 ms                  |

AND very easy

```js
import memofy from "memofy";

const dep1 = /** Variable to track change */

const heavyMethod = memofy((arg1, arg2, ...args) => {
 // calculate something then return
}, [dep1, dep2, ...deps]);

// heavyMethod looks at the deps and arguments every time it is called.
// If there is no change, it brings it from the cache. If there is a change, it runs the function again
```

## Installation

##### NPM

`npm install memofy`

##### YARN

`yarn add memofy`

## Usage case

### Without deps parameters

_In the following process, when the concatPhoneNumber method is called again with the same parameters, the function is not executed again, it fetches the result from the cache._

```js
import memofy from "memofy";

const concatPhoneNumber = (extension, number) => {
  // Heavy calculation
  // return result
};

const memoizedConcatPhoneNumber = memofy(concatPhoneNumber, []);

memoizedConcatPhoneNumber(90, 555); // Runs concatPhoneNumber once
memoizedConcatPhoneNumber(90, 555); // Don't run because fetched from cache (same parameter)
memoizedConcatPhoneNumber(90, 552); // Runs concatPhoneNumber because params is changed
```

### With deps parameter

_If you want the method to run again with the same parameter according to some dependencies, you can pass the deps parameter as follows._

```js
import memofy from "memofy";

const taxRatio = 0.5;
const product = { title: "Test product", price: 10 };

const calculateTax = () => {
  // Calculate tax by product price
  // Heavy calculation
  return taxRatio * product.price;
};

const memoizedConcatPhoneNumber = memofy(calculateTax, [product, taxRatio]);

calculatedPrice = calculateTax(); // Runs concatPhoneNumber when first run

product.price = 40;
let calculatedPrice = calculateTax(); // Runs concatPhoneNumber because product dep changed

taxRatio = 0.8;
calculatedPrice = calculateTax(); // Runs concatPhoneNumber because taxRatio changed
```

```js
import memofy from "memofy";

const products = [
  /**Let's say there are more than 100 products */
];

// It is costly to cycle through 100 products each time. Just keep the result in the cache when it runs once.
const getTotalPrice = () => {
  return products.reduce((acc, curr) => acc + curr.price, 0);
};

const _getTotalPrice = memofy(getTotalPrice, [products]);
getTotalPrice(); // Runs getTotalPrice once
getTotalPrice(); // Don't run because fetched from cache
products.push({
  /** a few products */
});
getTotalPrice(); // Runs again getTotalPrice because products is changed
```

## Declaration for typescript

```ts
type Deps = Readonly<Array<any>>;

type MemoizedFunction<Args extends Readonly<Array<any>>, ReturnType> = (
  ...args: Args
) => ReturnType;

function memofy<Args extends Readonly<Array<any>>, ReturnType>(
  _functionToMemoize: Function,
  _deps?: Deps
): MemoizedFunction<Args, ReturnType>;
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

| File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files     | 100     | 100      | 100     | 100     | 0                 |
| lib           | 100     | 100      | 100     | 100     | 0                 |
| index.ts      | 100     | 100      | 100     | 100     | 0                 |
| lib/store     | 100     | 100      | 100     | 100     | 0                 |
| CacheStore.ts | 100     | 100      | 100     | 100     | 0                 |
| DepsStore.ts  | 100     | 100      | 100     | 100     | 0                 |

## Contributing

_This is open source software. If you want, you can support it by becoming a contributor._ [Github Repository](https://github.com/ahmetilhn/memofy)
