# React中 ‘递’和‘归’


## workLoop 
React 中对fiber的遍历是在*workLoop*中进行的。

这是*workLoop*的方法体

```js
function workLoop(isYieldy) {
  // 对 nextUnitOfWork 循环进行判断，直到没有 nextUnitOfWork
  if (!isYieldy) {
    // Flush work without yielding
    // 一开始进来 nextUnitOfWork 是 root，每次执行 performUnitOfWork 后
    // 都会生成下一个工作单元
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until there's a higher priority event
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}
```

