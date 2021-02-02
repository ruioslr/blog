---
title: Promise
categories:
 - Javascript
tags:
 - Javascript
 - Promise
---

# Promise

### Promise是什么
Promise 有三个状态 pending, fullild, rejected, 只能由 pending 向其他状态转变， 且只有一次。

### Promise链式调用

几个结论：
- then 方法的回调函数，是在promise resolve 后，被放到**（宏/微）任务队列中**，而不是直接执行。
- 当执行 then 方法时，如果前面的 promise 已经是 resolved 状态，则**直接**将回调放入微任务队列中，（即： 一个promise里直接resolve(), 那么他后面的那个then会直接**放入队列**）
- 当一个 promise 被 resolve （即： 执行resolve方法）时，会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微**任务队列**中.
- 当promiseA的第一个then 或 catch 返回promise（记为promiseB）时，promiseA的第二个then会等到promiseB完成后，才会把它的回调放入**任务队列**，回调的参数就是promiseB resolve或catch的的值; 如果promiseA的第一个then返回的是一个同步值或没有return（即return undefined）则会将promiseA的第二个then的回调函数放入**任务队列**，回调函数的参数就是第一个then回调的返回值。
```js
let p = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000);
});
p.then(() => {
  console.log("log: 外部第一个then");
});
p.then(() => {
  console.log("log: 外部第二个then");
});
p.then(() => {
  console.log("log: 外部第三个then");
});

// 输出：
// log: 外部第一个then
// log: 外部第二个then
// log: 外部第三个then

```

### Promise链式调用顺序

先看几个例子： 

```js
new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
  .then(() => {
    console.log("外部第一个then");
    return new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
    .then(() => {
    console.log("内部第一个then");
    })
    .then(() => {
    console.log("内部第二个then");
    });
  })
  .then(() => {
    console.log("外部第二个then");
  });

// 输出
// 外部promise
// 外部第一个then
// 内部promise
// 内部第一个then
// 内部第二个then
// 外部第二个then
```

**结论： 当then方法返回一个promise时，下一个then方法会等到前一个then返回的promise resolve或reject后才会触发，（无论这个promise后面有多少个then，都会先执行）**

```js
new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
  .then(() => {
    console.log("外部第一个then");
    new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
      .then(() => {
        console.log("内部第一个then");
      })
      .then(() => {
        console.log("内部第二个then");
      });
  })
  .then(() => {
    console.log("外部第二个then");
  });

//   输出：
// 外部promise
// 外部第一个then
// 内部promise
// 内部第一个then
// 外部第二个then
// 内部第二个then

```

**结论：外部的第二个 then 的注册，需要等待 外部的第一个 then 的 （同步） 代码执行完成。resolve后，会把这个promise的第一个then的方法放入队列，后面的then需要等第一个then执行完后，才```放入队列``` **

```js
new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
  .then(() => {
    console.log("外部第一个then");
    let p = new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
    p.then(() => {
        console.log("内部第一个then");
      })
    p.then(() => {
        console.log("内部第二个then");
      });
  })
  .then(() => {
    console.log("外部第二个then");
  });

//   输出：
// 外部promise
// 外部第一个then
// 内部promise
// 内部第一个then
// 内部第二个then
// 外部第二个then
```

**结论：promise实例上挂载的then方法，会在resolve时，按挂载顺序放入队列**

```js
let p = new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
p.then(() => {
    console.log("外部第一个then");
    new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
      .then(() => {
        console.log("内部第一个then");
      })
      .then(() => {
        console.log("内部第二个then");
      });
  })
p.then(() => {
    console.log("外部第二个then");
  });

//   输出：
// 外部promise
// 外部第一个then
// 内部promise
// 外部第二个then
// 内部第一个then
// 内部第二个then
```

**结论：promise resolve之后，会按顺序执行通过then注册的代码。（走他们的同步代码）**

### 手写Promise

```js



```

