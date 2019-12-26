# ES6+ 新的数据结构

## Set
```js
const set1 = new Set('haha'); // set 构造函数可以接收实现 iterable 接口的数据结构
const set2 = new Set([1, 2, 3, 4, 5, 5]);
```

* 应用
```js
//  eg: 字符串去重： 
const str = 'abcvvvvsdfsaf';
console.log([...new Set(str)].join(""));
```

* set 数据结构 里 使用的 类似于 === ，所以 5 和 '5' 是两个不同的值，但是和 === 不同的是， NaN 和 NaN 是同一个, 而 NaN !== NaN
* 遍历 entries ，keys， values， forEach, Set的 key 和 value 完全一致，所以 keys， values，行为一致

* 交集，并集，差集 的实现
```js
// eg: 交集，并集，差集 的实现
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

// 并集： 
const union = new Set([...setA, ...setB]);
// 交集： 
const inter = new Set([...setA].filter(_ => setB.has(_)));
// 差集：
const diff = new Set([...setA].filter(_ => !setB.has(_)));
```

### WeakSet

#### WeakSet 与 Set 的区别有两个： 
* 1： WeakSet 存放的值， 只能是对象，
* 2， WeakSet的对象 是弱引用，(不加入垃圾回收机制的引用计数)，可能会被垃圾回收，即，可能取不到值，所以不能遍历

用处： 用来存储 Dom节点， 而不用担心节点在页面上被删除



## Map
map 的构造函数接收 具有 iterator 接口 且成员 都是双元素的 数据结构作为参数

```js
// 遍历
const map1 = new Map([[1,2], [2,3], [3,4]]);

console.log(map1);

map1.forEach((value, key)=> console.log(key,value))

console.log(...map1.keys()); // 是一个具有 iterator 的类数组（遍历器）
console.log(map1.values()); // 是一个具有 iterator 的类数组 （遍历器）
```

### WeakMap


与 Map 区别：
* 1， 只接受 对象作为key（除null，Symbol）（WeakSet 只接受对象作为值）
* 2, key 对应的对象是弱引用，不计入垃圾回收机制
* 3, WeakMap 只有 get()、set()、has()、delete() 四个 api


## Symbol

## Proxy

## Reflect

## Iterator

## Promise