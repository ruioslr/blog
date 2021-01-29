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

作者：yeyan1996
链接：https://juejin.cn/post/6844903972008886279
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

```

### 手写Promise

```js



```

