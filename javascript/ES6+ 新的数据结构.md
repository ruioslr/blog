---
title: ES6+ 新的数据结构
categories:
 - Javascript
tags:
 - Javascript
---

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

## Proxy 

* 当handler 是个空对象时， 表现为，无论是给 proxyObj 或者 originObj 赋值还是删除，两个 对象都会同步赋值， 但是 却占据不同的内存空间

```js
onst originObj1 = {
    a: 1,
    b: 2,
    c: 3,
}

const handler1 = {
    get: (target, propKey) => {
        // target 是源对象，propKey 是属性key
        console.log(target, propKey)
    } 
};
const proxyObj1 = new Proxy(originObj1, handler1);

// 当handler 是个空对象时， proxyObj 的表现如何

const originObj2 = {
    a: 1,
    b: 2,
    c: 3,
    d: '我要被删除了'
}

const handler2 = {};
const proxyObj2 = new Proxy(originObj2, handler2);

proxyObj2.a = 2;
delete proxyObj2.d;
originObj2.c = 4;

console.log('originObj2', originObj2) // originObj2 { a: 2, b: 2, c: 4 }
console.log('proxyObj2', proxyObj2) // proxyObj2 { a: 2, b: 2, c: 4 }
console.log(originObj2 === proxyObj2); // false

// 表现为，无论是给 proxyObj 或者 originObj 赋值还是删除，两个 对象都会同步赋值， 但是 却占据不同的内存空间

// Proxy的的第一个参数可以是函数（函数也是对象）
```

### Proxy 支持的操作

* get(target, propKey, receiver) 拦截对象的属性读取操作
* set(target, propKey, value, receiver)  拦截对象的属性设置操作
* has(target, propKey) 拦截操作：propKey in proxy，返回一个布尔值
* deleteProperty(target, propKey)：拦截delete proxy.xxx的操作，返回一个布尔值
...
* apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
* construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
 
***set操作时，第四个参数，和 get 的 第三个参数 一样，一般指向 Proxy 实***


## Reflect

基本上与Proxy 一一对应

## Iterator

## Promise