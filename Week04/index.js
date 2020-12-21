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
}

const trie = new Trie();
trie.insert("and");
trie.insert("about");
trie.insert("as");
trie.insert("boy");
trie.insert("because");
trie.insert("as");

console.log(trie);
