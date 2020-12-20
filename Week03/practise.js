// 无重复字符的最长子串
var lengthOfLongestSubstring = function (s) {
  if (!s) return 0;
  let ret = "";
  let max = 0;
  for (let i of s) {
    if (ret.includes(i)) {
      ret = ret.slice(ret.indexOf(i) + 1);

      ret += i;
    }
    max = Math.max(max, ret.length);
  }

  return max;
};

// 6  Z 字形变换
var convert = function (s, numRows) {
  const len = s.length;
  let i = 0;
  let ret = new Array(numRows).fill("");
  for (let j = 0; j < len; j++) {
    ret[i] += s[j];
    if (i === numRows - 1) {
      i = 0;
      for (let k = ret.length - 1; k > 0; k--) {
        console.log(k);
        j++;
        if (j > len - 1) break;
        ret[k - 1] += s[j];
      }
    }
    i++;
  }
  return ret.join("");
};

// 字符串转换整数
var myAtoi = function (s) {
  s = s.trim();
  const reg = /^([\+|\-]?\d*)/;
  const match = reg.exec(s)[0];
  if (!match || match === "+" || match === "-") return 0;

  if (match > Math.pow(2, 31) - 1) return Math.pow(2, 31) - 1;
  if (match < -Math.pow(2, 31)) return -Math.pow(2, 31);

  return Number(match);
};
