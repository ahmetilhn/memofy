import memofy from "memofy";
var product = { name: "Test Product", price: 36 };
var getProductPrice = function (_product) {
    return _product.price.toLocaleString();
};
console.log(performance.now(), "ggg");
console.log(getProductPrice(product));
console.log(performance.now());
var _getPrice = memofy(getProductPrice, []);
// Runs once because uncached
console.log(performance.now());
console.log(_getPrice(product)); // 36
console.log(performance.now());
// Don't run because cached then fetch from cache
console.log(performance.now());
console.log(_getPrice(product)); // 36
console.log(performance.now());
product.price = 50;
// Runs again because dep changed (production)
console.log(performance.now());
console.log(_getPrice(product)); // 50
console.log(performance.now());
var getProductName = function () {
    return product.name;
};
var _getProductName = memofy(getProductName, [product]);
// Runs once because uncached
console.log(performance.now());
console.log(_getProductName()); // Test Product
console.log(performance.now());
// Don't run because cached
console.log(performance.now());
console.log(_getProductName()); // Test Product
console.log(performance.now());
product.name = "Test Product 2";
// Runs again because dep changed (production)
console.log(performance.now());
console.log(_getProductName()); // Test Product
console.log(performance.now());
