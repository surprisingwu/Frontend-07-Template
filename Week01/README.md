#### for await ...of

> 这一块之前没有怎么了解过, 居然还可以这么使用.

-   `for await...of` 语句创建一个循环，该循环遍历异步可迭代对象以及同步可迭代对象，包括: 内置的 String, Array，类似数组对象 (例如 arguments 或 NodeList)，TypedArray, Map, Set 和用户定义的异步/同步迭代器。
    -   主要目的是用来编译异步迭代器.
-   基本使用如下

```js
var asyncIterable = {
    [Symbol.asyncIterator]() {
        return {
            i: 0,
            next() {
                if (this.i < 3) {
                    return Promise.resolve({ value: this.i++, done: false });
                }

                return Promise.resolve({ done: true });
            },
        };
    },
};

(async function () {
    for await (num of asyncIterable) {
        console.log(num);
    }
})();

// 0
// 1
// 2
```
