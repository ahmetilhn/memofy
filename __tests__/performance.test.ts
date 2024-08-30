import memofy from "../lib";
describe("Performance Tests", () => {
  test("should execute heavy method with and without caching", async () => {
    const heavyComputation = jest.fn(
      async (inputNumber: number): Promise<number> => {
        let sum = 0;
        function isPrime(num: number): boolean {
          if (num <= 1) return false;
          if (num <= 3) return true;
          if (num % 2 === 0 || num % 3 === 0) return false;
          let i = 5;
          while (i * i <= num) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
            i += 6;
          }
          return true;
        }
        for (let i = 2; i <= inputNumber; i++) {
          while (inputNumber % i === 0) {
            if (isPrime(i)) {
              sum += i;
            }
            inputNumber /= i;
          }
        }
        return sum;
      }
    );

    // Before caching
    const _heavyComputation = memofy(heavyComputation);
    const startTime = performance.now();
    const result = await _heavyComputation(91012323);
    const endTime = performance.now();
    const timeDiff = endTime - startTime;
    console.log("Before caching", timeDiff, " ms");
    expect(result).toEqual(30337444);
    expect(timeDiff).toBeGreaterThanOrEqual(45);
    expect(heavyComputation).toHaveBeenCalledTimes(1);

    // After caching
    const newStartTime = performance.now();
    const newResult = await _heavyComputation(91012323);
    const newEndTime = performance.now();
    const newTimeDiff = newEndTime - newStartTime;
    console.log("After caching", newTimeDiff, " ms");
    expect(newResult).toEqual(30337444);
    expect(newTimeDiff).toBeLessThanOrEqual(7);
    expect(heavyComputation).toHaveBeenCalledTimes(1); // Because value returned cache
  });
});
