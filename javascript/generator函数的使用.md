---
title: Generator 函数的使用
categories:
 - Javascript
tags:
 - Javascript
---

# Generator 函数的使用

## 什么是generator函数

由于JavaScript是单线程的， 为了防止耗时的任务阻塞整个程序，**异步**显得尤为重要。而异步如果处理的不好，很容易陷入异步回调地狱。在ES6中，引入了generator函数的概念，用来解决异步的问题。

----
## Genetator函数应用场景

目前generator函数比较常见的应用场景是 [nodejs](http://nodejs.cn/)服务端框架[Koa](https://github.com/koajs/koa)(v1)，和redux处理异步的中间件[redux-saga](https://github.com/redux-saga/redux-saga)中。

----
## Generator函数的具体使用方法

generator函数最大的特点就是可以暂停执行。

```javascript

function* gen(x){
  var y = yield x + 2;
  return y;
}

```
上述代码就是一个简单的generator函数，其执行方法如下

```javascript

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }

```
调用generator函数时，会返回一个遍历器，当调用遍历器的next()方法时，函数开始执行，直到遇到第一个yield(或者return)，返回一个对象，对象的value属性的值是yield后面表达式的值，done属性的值是一个布尔值，标志当前generator函数是否执行完成。

----
## 使用generator函数的一些注意点

### yeild表达式
Generator函数返回的是遍历器对象，但调用遍历器对象的next()方法后，函数开始执行，直到碰到yeild(return先不考虑)，此时，函数会暂停执行，并将yeild后面的表达式作为返回对象的value值。

注意：

1. 在执行到yeild是，函数会暂停执行。
2. 一直调用next(),函数会在碰到**return**后停止执行并和yeild一样将后面的表达式作为返回对象的value属性的值返回，此时，如果继续调用next(),返回的对象的value属性为undefined，done为true。
3. yeild后面的表达式只要在调用next()方法后才会执行而非立即执行。
4. Generator函数可以不用yeild表达式，这样，generator函数就变成了一个普通的**暂缓执行函数**，在调用next()后开始执行
5. yeild表达式不可以在其它非generator函数里面使用，否则会报错。

### next方法的参数

yeild 表达式并没有返回值（或者说其返回值是undefined）,例如 `var a = yeild 2`,执行 **下一个next()** 后，a的值其实是undefined。正因如此，next方法是可以带参数的，在执行next()后，next方法的参数会赋值给**上一个yeild表达式**，例如刚才的`var a = yeild 2` 如果下一个执行的是next(9),那么执行之后a的值就是9。如下

```javascript

function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b

```

如果想要第一次调用next方法时，就能够输入值，可以在 Generator 函数外面再包一层。

```javascript

function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!

```

上面代码中，Generator 函数如果不用wrapper包一层，就无法第一次调用next方法，就输入参数的。

### Generator.prototype.return() 

generator函数调用后返回的遍历器对象可以调用return(params)方法,用来返回return里的值，且终结generator函数的执行

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }

```
----
## Genetator函数应用场景

### 1,异步操作的同步化表达

其异步的典型场景是ajax请求：

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();

```

<br>
<br>
<br> 

参考：[阮一峰老师的博客](http://es6.ruanyifeng.com/#docs/generator)