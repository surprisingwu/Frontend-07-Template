// 字典树
let $ = Symbol(0);
class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  insert(s) {
    let node = this.root;

    for (const i of s) {
      if (!node[i]) {
        // node[i] = new Trie();
        node[i] = Object.create(null);
      }
      node = node[i];
    }
    if (!node[$]) {
      node[$] = 0;
    }
    node[$]++;
  }
  most() {
    let max = 0;
    let maxWord = null;
    let callBack = (node, word) => {
      // 尾点
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }

      // 遍历key
      for (let s in node) {
        callBack(node[s], word + s);
      }
    };
    callBack(this.root, "");
    return maxWord;
  }
}

// const trie = new Trie();
// trie.insert("and");
// trie.insert("about");
// trie.insert("as");
// trie.insert("boy");
// trie.insert("because");
// trie.insert("as");

// console.log(trie.most());

// KMP
// a b c d a b c e f
// 0 0 0 0 0 1 2 3 0

function KMP(source, pattern) {
  // pattern 是否有自重复表格
  const table = new Array(pattern.length).fill(0);
  let i = 1;
  let j = 0;

  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      ++i;
      ++j;
      table[i] = j;
    } else {
      // 如果匹配不上, 回到前面匹配到的位置. 没有必要重头开始算
      if (j > 0) j = table[j];
      else ++i;
    }
  }
  console.log(table);
  i = 0;
  j = 0;
  while (i < source.length) {
    if (source[i] === pattern[j]) {
      ++i;
      ++j;
    } else {
      if (j > 0) j = table[j];
      else ++i;
    }
    if (j === pattern.length) {
      return true;
    }
  }

  return false;
}

// KMP("", "ababacb");
// console.log(KMP("abababaabab", "ababacb"));

// wildcard

function wildcard(source, pattern) {
  let starCount = 0;
  const patternLen = pattern.length;
  const sourceLen = source.length;

  // 遍历模式串. 记录 * 的总量
  for (let i = 0; i < patternLen; i++) {
    if (pattern[i] === "*") starCount++;
  }

  // 边界条件. 没有通配符
  if (starCount === 0) {
    for (let i = 0; i < sourceLen; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") return false;
    }
    return true;
  }

  let lastIndex = 0;
  let i = 0;
  // 找到第一个 * 号
  for (; pattern[i] !== "*"; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== "?") return false;
  }

  lastIndex = i;

  for (let j = 0; j < starCount - 1; j++) {
    i++;
    let subPattern = "";
    while (pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }

    const reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    reg.lastIndex = lastIndex;

    console.log(reg.exec(source));
    if (!reg.exec(source)) return false;

    lastIndex = reg.lastIndex;
  }

  for (let j = 0; j <= sourceLen - lastIndex && pattern[patternLen - j] !== "*"; j++) {
    if (pattern[patternLen - j] !== source[sourceLen - j] && pattern[patternLen - j] !== "?")
      return false;
  }

  return true;
}

console.log(wildcard("mississippi", "m??*ss*?i*pi"));
