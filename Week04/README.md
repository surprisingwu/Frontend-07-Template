#### 字典树

> 字典树又称单词查找树，**Trie** 树，是一种树形结构，是一种哈希树的变种。典型应用是用于统计，排序和保存大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。

- 优点
  - 字典树利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。

* 字典树的作用
  - 统计,排序和保存大量的字符串
* 字典树的特点
  - 节点存储字符. 字典树的节点存储的是单词的字符(字母)
  - 单词尾字符加标记. 为了表示一个单词是否出现,我们可以给单词的最后的字符加上标记
  - 链表示单词. 字典树中表示一个单词用的是一条链.
* 大致实现

```js
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
```

### kmp 算法

> KMP 也是一种优化版的前缀算法，之所以叫 KMP 就是 Knuth、Morris、Pratt 三个人名的缩写，对比下 BF 那么 KMP 的算法的优化点就在“每次往后移动的距离”它会动态的调整每次模式串的移动距离，BF 是每次都+1，KMP 则不一定.

- kmp 算法的关键是就是计算模式串的匹配表. 匹配表中记录了,模式串匹配不到时候,回退的位置. 因此 kmp 算法基本实现可以分俩步来做
  - 先计算模式串的匹配表
  - 遍历源串进行匹配. 匹配不到的时候, 进行回退到标记处. 而不是直接回退到开始.

* **kmp** 算法实现大致如下

```js
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
```

### Wildcard 算法

> 通配符匹配. 模式串支持`*`和`?`.

- 要注意的是多个`*`号时, 前面的是尽可能少的匹配(有可能是 0 个). 最后一个星号是尽可能多的匹配.`?`是任意一个字符
- 代码实现步骤

  - 找到模式串中`*`号的数量.
    - 如果没有`*`号, 则认为是严格匹配
  - 匹配第一个`*`号前的字符,并找到`*`号的位置.记录星号的位置
  - 根据星号的位置,再源串中匹配后面的`*`号前的字符
  - 匹配最后一个星号后面的字符.剩下的则是最后一个`*`匹配的字符

- 代码实现

```js
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
    for (let i = 0; i < patternLen; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") return false;
    }
    return true;
  }

  let lastIndex = 0;
  let i = 0;
  // 找到第一个 * 号  前面要严格匹配
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
```
