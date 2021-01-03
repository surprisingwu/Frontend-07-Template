## Proxy and rang 

#### Proxy and Reflect
> 语法: `let p = new Proxy(target, handler);`
`target`:  用`Proxy`包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
`handler`: 一个对象，其属性是当执行一个操作时定义代理的行为的函数。

> `Proxy.revocable(target, handler);`可以创建一个可以撤销的代理对象, 返回一个对象{proxy: proxyObj, revoke: revokeFn}, 
`proxy`: 该属性的值为新生成的代理的对象本身
`revoke`: 撤销方法, 调用的时候不需要加任何参数, 就可以撤销掉和它一起生成的那个代理对象。代理撤销后, 代理对象在访问陷阱函数时会抛出错误
代理对象的行为会代理到目标对象上, 但是对目标对象没有影响
* 代理的陷阱函数图表, 代理陷阱和`js引擎`默认的行为

| 代理陷阱 | 被重写的行为  | 默认行为  |
| :----------------: | :--------------: | :---------------: |
|           get           |                             读取一个属性的值                              |           Reflect.get()            |
|           set           |                               写入一个属性                                |           Reflect.set()            |
|           has           |                                 in 运算符                                 |           Reflect.has()            |
|     deleteProperty      |                               delete 运算符                               |      Reflect.deleteProperty()      |
|     getPrototypeOf      |                          Object.getPrototypeOf()                          |      Reflect.getPrototypeOf()      |
|     setPrototypeOf      |                         Object.setPrototypeOf ()                          |     Reflect.setPrototypeOf ()      |
|      isExtensible       |                          Object. isExtensible()                           |       Reflect.isExtensible()       |
|    preventExtensions    |                        Object.preventExtensions()                         |    Reflect.preventExtensions()     |
| getOwnPropertyDesciptor |                     Object.getOwnPropertyDesciptor ()                     | Reflect.getOwnPropertyDesciptor () |
|     defineProperty      |                          Object.defineProperty()                          |      Reflect.defineProperty()      |
|         ownKeys         | Object.keys Object.getOwnPropertyNames()与 Object.getOwnPropertySymbols() |         Reflect. ownKeys()         |
|          apply          |                               调用一个函数                                |          Reflect.apply()           |
|        construct        |                           使用 new 调用一个函数                           |        Reflect. construct()        |

#### `set`陷阱函数(访问器属性), 接受 4 个参数

- `trapTarget`: 将接收属性的对象(代理的目标对象)
- `key`: 需要写入的属性的键(字符串类型或符号类型)
- `value`: 将被写入属性的值
- `receiver`: 操作发生的对象(通常是代理对象)
- 对应的默认的行为`Reflect.set()`接收的参数和陷阱函数一致

```JavaScript
const handler = {
      set: function(target, key, value, receiver) {
        if(!target.hasOwnProperty(key)) {
          if(typeof value !== 'number'||isNaN(value)) {
            throw new Error('value must number')
          }
          return Reflect.set(target, key, value, receiver)
        }
      }
    }
    const target = {
      name: 'wyt'
    }

    const p = new Proxy(target, handler)
    p.age = 18
    p.sex = 'wyt' // 报错
```

#### `get`陷阱函数(访问器属性), 接收三个参数

- `trapTarget`: 将会读取属性的对象(代理的目标对象)
- `key`: 需要读取属性的键(基本类型)
- `receiver`: 操作发生的对象(通常是代理对象)

```javascript
const handler = {
  get: function (target, key, receiver) {
    // 这里使用receiver(拥有has陷阱函数)
    if (!(key in receiver)) {
      throw new Error("not match key");
    }
    return Reflect.get(target, key, receiver);
  },
};
const target = {
  name: "wyt",
};

const p = new Proxy(target, handler);
p.age = 18;
console.log(p.sex);
```

#### `has`陷阱函数(在使用`in`运算符被调用): 接收俩个参数

- `trapTarget`: 将会读取属性的对象(代理的目标对象)
- `key`: 需要读取属性的键(基本类型)

```JavaScript
const handler = {
      has: function(target, key) {
        if(target.hasOwnProperty(key)) {
          return true
        }
        return false
      }
    }
    const target = {
      name: 'wyt'
    }

    const p = new Proxy(target, handler)
    console.log('toString' in p)  // false
    console.log('name' in p);  // true
```

#### `deleteProperty`陷阱函数(在使用`delete`运算符调用): 接收俩个参数

- 对象的属性是否可以被删除,依赖其数据属性的`[[Configable]]`是否为`true`, 不过陷阱函数, 可以对为`true`的属性做一些操作
- `trapTarget`: 需要删除属性的对象(即代理的目标对象)
- `key`: 需要删除的属性的键(字符串类型或符号类型)

```JavaScript
const handler = {
      deleteProperty(target, key) {
        // 这里先假定vlaue属性不能被删除
        if(key === 'value') {
          return false
        }
        return Reflect.deleteProperty(target, key)
      }
    }
    const target = {
      name: 'wyt',
      age: 18,
      value: 16
    }
   // Object.defineProperty(target,'value',{
   //   configurable: false
   // })
    const p = new Proxy(target, handler)
    console.log('value' in p);
    console.log(delete p.value);
    console.log('value' in p);
```

#### 原型代理的陷阱函数: `setPrototypeOf和getPrototypeOf`

- `setPrototypeOf`: 会对对象的`Object.setPrototypeOf(obj, proto)`进行拦截, 同样接收俩个参数
  - `trapTarget`: 需要设置原型的对象(即代理的目标对象)
  - `proto`: 需要被用作原型的对象
  - 返回一个布尔值, 表示设置是否成功
- `getPrototypeOf`: 会对对象的`Object.getPrototypeOf(obj)`的行为进行拦截, 接收一个参数
  - `trapTarget`: 需要获取原型的对象(即代理的目标对象)
- 上面的陷阱函数, 执行的默认行为是`Reflect.setPrototype和Reflect.getPrototypeOf()`, 这些函数和`Object`原型上的函数还是有差异的
  - `Object.setPrototypeOf(obj, proto)和Reflect.setPrototypeOf`:
    - 第二个参数都要求是`null || object`传入其他参数会报错
    - 前者操作会返回`obj`
    - 后者返回布尔值. 来表示设置是否成功
  - `Object.getPrototypeOf(obj)和Reflect.getPrototypeOf`:
    - 前者会在操作之前先将参数值转换为一个对象(隐式转换,基本类型转换为对应的包装类型, 但是必须是有效值 `null和undefined会报错`)
    - 而后者要求参数必须是对象, 其它参数会报错

```JavaScript
const handler = {
      setPrototypeOf(target, proto) {
        return Reflect.setPrototypeOf(target, proto)
      },
      getPrototypeOf(target) {
       return Reflect.getPrototypeOf(target)
      }
    }
    const target = {
      name: 'wyt',
      age: 18,
      value: 16
    }
    const p = new Proxy(target, handler)
    const proto = Object.setPrototypeOf(p, null)
    const _proto = Object.setPrototypeOf(target, null)
    console.log(proto, _proto);

    const pt = Reflect.getPrototypeOf(null) // error
    const _pt = Object.getPrototypeOf(22) // 返回对应的包装类型

```

#### 可扩展的陷阱函数: `preventExtensions 和 isExtesible`

- `preventExtensions`: 是对`Object.preventExtensions()`做的拦截, 阻止对象可扩展
- `isExtensible`: 是对`Object.isExtensible()`检测对象是否可扩展
  - 上面俩个方法都只接收一个参数`trapTarget`, 需要设置或要获取是否可扩展的代理对象
  - 一旦禁止对象扩展, 则对象不能添加其他的属性类似的方法还有
    - `Object.preventExtensions(o)`: 阻止对象扩展, 不能再添加新的属性, 但是可以操作已有属性(删除,枚举,可写等)
    - `Obejct.isExtensible(o)`: 检测对象是否可扩展
    - `Object.freeze(o)`:这个方法比 Object.seal 更绝，冻结对象是指那些不能添加新的属性，不能修改已有属性的值，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性的对象。也就是说，这个对象永远是不可变的。
    - `Object.seal(o)`: 让一个对象密封，并返回被密封后的对象。密封对象是指那些不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可以修改已有属性的值的对象
    - `Object.isFrozen(o)`: 检测一个对象是否被冻结
    - `Obejct.isSealed(o)`: 检测一个对象是否被密封

```JavaScript
const handler = {
	preventExtensions(target) {
		return Reflect.preventExtensions(target)
	},
	isExtensible(target) {
		return Reflect.isExtensible(target)
	}
}

const target = {
	name: 'wyt',
	age: 12
}

   const p = new Proxy(target, handler)

    console.log(Object.isExtensible(p));
    console.log(Object.isExtensible(target));
    console.log(Object.preventExtensions(p));
    console.log(Object.isExtensible(p));
    console.log(Object.isExtensible(target));
```

#### 属性描述符的陷阱函数: `defineProperty 和 getOwnPropertyDescriptor`

- `defineProperty`是对`Object.defineProperty()`进行拦截, 接收三个参数
  - `target`: 需要被定义属性的对象(即代理的目标对象)
  - `key`: 属性的键(字符串类型或者符号类型)
  - `descriptor`: 该属性准备的描述符对象
- `getOwnPropertyDescriptor`: 是对`Object.getOwnPropertyDescriptor()`进行拦截的, 接收俩个参数
  - `target`: 需要获取属性的对象(即代理的目标对象)
  - `key`: 属性的键(字符串类型或者符号类型)

```JavaScript
const handler = {
// 这里可以拦截我们不想被修改的属性, 只需要返回false(报错)就可以
	 defineProperty(target, key, descriptor) {
        // 非标准属性无效
        descriptor = Object.assign({}, descriptor, {
          name: 'key',
          age: '22'
        })
        return Reflect.defineProperty(target, key, descriptor)
        // return false
      },
      getOwnPropertyDescriptor(target, key) {
        // 如果返回的是对象,对象的属性必须是标准属性, 否则报错
        return Reflect.getOwnPropertyDescriptor(target, key)
        // return {
        //   value: target[key],
        //   configurable: false,
        //   writable: false,
        //   enumerable: false
        // }      }
    }
    const target = {
      name: 'wyt',
      age: 18,
      value: 16
    }

    const p = new Proxy(target, handler)

    Object.defineProperty(p, 'sex', {
      configurable: false,
      writable: false,
      enumerable: false,
      value: 'male'
    })
```

- 描述符对象的限制:
  - 对象的自有属性: `enumerable,configurable,value, writable, get, set`
  - `Object.defineProperty(o,k,d)`: 第三个参数: 可以是任意的对象, 但是只有对象的自由属性是被许可的(`Reflect.defineProperty`同样也会忽略非标准属性)
  - `getOwnPropertyDescriptor`: 的返回值必须是`null,undefined,对象`, 如果是一个对象, 则对象的属性也必须是上面的自有属性, 有其它非标准属性时会报错
- 方法的差异
  - `Object.defineProperty和Reflect.defineProperty`
    - 前者返回第一个参数
    - 后者操作成功返回`true,` 否则返回`false`
  - `Object.getOwnPropertyDescriptor和Object.getOwnPropertyDescruptor`
    - 前者第一个参数是基本类型值时, 会隐式转换为对应的包装类型
    - 后者第一个参数是基本类型的时候, 会报错

#### `ownKeys`陷阱函数

- 该代理陷阱拦截了内部方法`[[OwnPropertykeys]]`, 并允许你返回一个数组用于重写该行为. 返回的这个数组会被用于四个方法: `Object.keys,Object.getOwnPropertyNames,Object.getOwnPropertySymbols, Object.assign`. 其中`Object.assign()`方法会使用该数组来决定哪些属性会被复制
- 只接收一个参数: `target`: 需要获取的对象(即代理对象)

```JavaScript
const handler = {
ownKeys(target) {
        // 这里假定要求key如果是字符串, 则不能下划线开头
        return Reflect.ownKeys(target).filter((k,i,c) => {
          return typeof k !== 'string' || k[0] !== '_'
        })
      }
    }
    const target = {
      name: 'wyt',
      age: 18,
      value: 16
    }
    const KEY = Symbol('name')
    const p = new Proxy(target, handler)
    p['_name'] = 'hhh'
    p[KEY] = 'gg'

    console.log(Object.keys(p));
    console.log(Object.getOwnPropertyNames(p));
    console.log(Object.getOwnPropertySymbols(p));
    console.log(Object.assign({}, p, {
      '_tt': 11
    }));
```

* 可以利用`Proxy和Reflect`对`js`底层的代码行为进行拦截和操作, 可以增加代码的可操作性. 但是同时也造成了代码的行为变的不可预期. 需要谨慎使用
### range 

> `Range`接口表示一个包含节点与文本节点的一部分的文档片段.Range对象代表页面上一段连续的区域，通过Range对象可以获取或者修改页面上任何区域的内容。也可以通过Range的方法进行复制和移动页面任何区域的元素。

* 可以用 `Document` 对象的 `Document.createRange` 方法创建 `Range`，也可以用 `Selection` 对象的 `getRangeAt` 方法获取 `Range`。另外，还可以通过 `Document` 对象的构造函数 `Range()` 来得到 `Range`。

```js
var  range = document.createRange();
```
* 在`html5`中，每一个浏览器窗口都会有一个`selection`对象，代表用户鼠标在页面中所选取的区域，(注意：经过测试IE9以下的浏览器不支持`Selection`对象), 可以通过如下语句创建`selection`对象；

```js

var  selection = document.getSelection();   
或者
var  selection  = window.getSelection();
```
* 每一个selection对象都有一个或者多个Range对象，每一个range对象代表用户鼠标所选取范围内的一段连续区域，在firefox中，可以通过ctrl键可以选取多个连续的区域，因此在firefox中一个selection对象有多个range对象，在其他浏览器中，用户只能选取一段连续的区域，因此只有一个range对象。
可以通过selection对象的getRangeAt方法来获取selection对象的某个Range对象，如下：
getRangeAt方法有一个参数index，代表该Range对象的序列号；我们可以通过Selection对象的rangeCount参数的值判断用户是否选取了内容；
1.当用户没有按下鼠标时候，该参数的值为0.
2.当用户按下鼠标的时候，该参数值为1.
3.当用户使用鼠标同时按住ctrl键时选取了一个或者多个区域时候，该参数值代表用户选取区域的数量。
4.当用户取消区域的选取时，该属性值为1，代表页面上存在一个空的Range对象；
* `Range`对象的属性和方法
  * `startContainer`: 包含“起点”的节点。“包含”的意思是起点所属的节点。
  * `endContainer`: 包含“结束点”的节点
  * `startOffset`: “起点”在`startContainer`中的偏移量。
    * 如果`startContainer`是文本节点、注释节点或CDATA节点，则返回“起点”在startContainer中字符偏移量。
如果startContainer是元素节点，则返回“起点”在startContainer.childNodes中的次序。

#### range对象的一些方法
* `setStart(node, offset)和setEnd(node, offset)`
  * `setStart`：设置起点的位置，`node`是对`startContainer`的引用，偏移则是`startOffset`；
  * `setEnd`：设置结束点的位置，`node`是对`endContainer`的引用，偏移则是`startOffset`；
* `cloneRange`: `cloneRange()`方法将返回一个当前`Range`的副本，它也是`Range`对象。
注意它和cloneContents()的区别在于返回值不同，一个是HTML片段，一个是Range对象 。代码如下：
* `cloneContents`:可以克隆选中`Range`的`fragment`并返回改`fragment`。这个方法类似`extractContents()`，但不是删除，而是克隆。代码如下：
```js
function cloneContents() {
             var rangeObj = document.createRange();
             rangeObj.selectNodeContents(document.getElementById("p"));
             var rangeClone = rangeObj.cloneContents();
             alert(rangeClone.toString());
         }
```
* `deleteContents`:
  * 从`Dom`中删除`Range`选中的`fragment`。注意该函数没有返回值（实际上为`undefined`）。
代码如下：

```js
 function delRange() {
             var rangeObj = document.createRange();
             rangeObj.selectNodeContents(document.getElementById("p"));
             var rangeClone = rangeObj.deleteContents();             
         }
```

* `extractContents`:
  * 将选中的`Range`从`DOM`树中移到一个`fragment`中，并返回此`fragment`。代码如下:

```js
 function moveContent() {
        var srcDiv = document.getElementById("srcDiv");
        var distDiv = document.getElementById("distDiv");
        var rangeObj = document.createRange();
        rangeObj.selectNodeContents(srcDiv);
        var docFrangMent = rangeObj.extractContents();
        distDiv.appendChild(docFrangMent);
    }
```
* insertNode
  * `insertNode`方法可以插入一个节点到`Range`中，注意会插入到`Range`的“起点”。代码如下：

```js
    var oP1 = document.getElementById("p1");
    var oHello = oP1.firstChild.firstChild;
    var oWorld = oP1.lastChild;
    var oRange = document.createRange();
    var oSpan = document.createElement("span");
    oSpan.appendChild(document.createTextNode("Inserted text"));
    oRange.setStart(oHello, 2);
    oRange.setEnd(oWorld, 3);
    oRange.insertNode(oSpan);
```

