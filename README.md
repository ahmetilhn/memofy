# memofy

## Cache mechanism for functions executed with the same parameters

#### This project provides a memoize function for improving performance in JavaScript or TypeScript projects by caching the results of expensive function calls. By memoizing, repeated calls with the same arguments will return the cached result, speeding up execution.

**This module works like react's useMemo hook.**

## Features

- Function Memoization: Caches results of function calls with the same arguments.
- Dependency Tracking: Updates the cache if dependencies change.
- Flexibility: Usable in both JavaScript and TypeScript projects.
- The best solution for CPU-intensive operations or complex calculations
- The disconnected functions are deleted from memory. The caches belonging to this function are also deleted.
- WeakMap based cache store
- WeakMap Disconnects methods that cannot communicate with weak reference links and triggers the garbage collector to kick in

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

memoizedConcatPhoneNumber(90, 555); // Runs concatPhoneNumber when first run
memoizedConcatPhoneNumber(90, 555); // get value from cache
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
