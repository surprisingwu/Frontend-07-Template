## 笔记

#### 广度搜索和深度搜索

```js
const rootEl = document.getElementById("app");

function BFS(node) {
    const nodes = [];
    if (nodes === null) return node;
    const queue = [];
    queue.push(node);

    while (queue.length) {
        const node = queue.shift();
        nodes.push(node);
        const currentChildren = node.children || [];
        for (let i = 0, len = currentChildren.length; i < len; i++) {
            queue.push(currentChildren[i]);
        }
    }

    return nodes;
}

function DFS(node) {
    const nodes = [];

    if (node === null) return nodes;
    const stack = [];
    stack.push(node);
    while (stack.length) {
        const node = stack.pop();
        nodes.push(node);

        const currentChildren = node.children || [];
        for (let i = currentChildren.length - 1; i >= 0; i--) {
            stack.push(currentChildren[i]);
        }
    }

    return nodes;
}
```

-   通过一个遍历一个`dom`树,可以看出广度搜索和深度搜索, 大致逻辑是一样的,不一样的是存放数据的结构不一样. 广度搜索的数据结构类似一个队列,深度搜索的数据结构类似一个栈.
-   俩者有自己的优劣势, 都有自己的使用场景
-   广度搜索

    -   优点
        -   对于解决最短或最少问题特别有效，而且寻找深度小
        -   每个节点只访问一遍, 节点总是以最短路径被访问,所以第二次路径确定不会比第一次短
    -   缺点
        -   性能比较差

-   深度搜索

    -   优点
    -   能找出所有解决方案
    -   优先搜索一棵子树，然后是另一棵，所以和广搜对比，有着内存需要相对较少的优点
    -   缺点
        -   要多次遍历，搜索所有可能路径，标识做了之后还要取消。
        -   在深度很大的情况下效率不高

#### 参考博客

-   [路径规划值 A\*算法](https://zhuanlan.zhihu.com/p/54510444)
