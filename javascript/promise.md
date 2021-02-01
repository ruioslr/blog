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
- 当执行 then 方法时，如果前面的 promise 已经是 resolved 状态，则直接将回调放入微任务队列中
- 当一个 promise 被 resolve 时，会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微任务队列中

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

### 手写Promise

```js



```

