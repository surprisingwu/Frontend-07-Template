var myPow = function(x: number, n: number): number {
  const isNegative = n < 0; 
  const result = absMyPow(x, Math.abs(n));
  return isNegative ? 1 / result : result;
};

function absMyPow(base: number, exponent: number): number {
  if (exponent === 0) {
      return 1;
  }

  if (exponent === 1) {
      return base;
  }

  // 不然会超时
  const subResult = absMyPow(base, Math.floor(exponent / 2));
  return exponent % 2 ? subResult * subResult * base : subResult * subResult;
}

var isNumber = function(s) {
  return /^[+-]?(\d+(\.\d*)?|(\.\d+))(e[+-]?\d+)?$/i.test(s.trim());
};


var minNumber = function (nums) {
  return nums.sort(function (a, b) {
    return Number(`${a}${b}`) - Number(`${b}${a}`)
}).join('')

}

