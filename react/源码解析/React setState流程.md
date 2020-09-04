# React 整体流程速览

## React15架构
* Reconciler
* Renderer

## React16架构
* Scheduler 
* Reconciler
* Renderer

**带来的更新：**  1，新添加了Scheduler层。2，Reconciler 变成了 Fiber Reconciler，之前的Reconiler是与Renderer交替执行，现在变为在Reconiler阶段为虚拟DOM打上标记，然后统一在Renderer层更新。

``` js
ReactDOM.render(<App/>, document.getElementById('root'));
```
react 会在首次渲染时，创建 *FiberRoot* 和 *RootFiber*,其中*FiberRoot*是整个应用的根节点，而*RootFiber* 是当前组件树的根节点。*FiberRoot.current === RootFiber*

**React每次触发更新都会从根节点开始向下遍历**

## **setState** 之后的流程
setState 实际上调用的是 **this.updater.enqueueSetState**，其中**updater**是构建ClassComponent实例时 ```constructClassInstance -> adoptClassInstance``` 执行的。

这是 adoptClassInstance 的方法体
```js
function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  // setState = this.updater.enqueueSetState
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  // The instance needs access to the fiber so that it can schedule updates
  // 用于获取 fiber
  // instance._reactInternalFiber = workInProgress
  setInstance(instance, workInProgress);
}
```
这是 enqueueSetState的方法体

```js
  enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback, 'setState');
      }
      update.callback = callback;
    }

    flushPassiveEffects();
    // 这里会将更新放在 Component 对应的fiber的updateQueue上
    enqueueUpdate(fiber, update); 
    // 开始调度
    scheduleWork(fiber, expirationTime);
  }
```

在```enqueueSetState```中会将本次更新放入组件对应的**fiber**的**updateQueue**上，然后开始调度更新（*scheduleWork*）
这是scheduleWork的方法体
```js
function scheduleWork (fiber: Fiber, expirationTime: ExpirationTime) {
  // 获取 fiber root
  const root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) {
    return;
  }
  // 这个分支表示高优先级任务打断低优先级任务
  // 这种情况发生于以下场景：有一个优先级较低的任务（必然是异步任务）没有执行完，
  // 执行权交给了浏览器，然后再交还给 JS 的时候有一个新的高优先级任务进来了
  // 这时候需要去执行高优先级任务，所以需要打断低优先级任务
  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime > nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    // 记录被谁打断的
    interruptedBy = fiber;
    // 重置 stack，具体来说应该是 valueStack
    resetStack();
  }
  markPendingPriorityLevel(root, expirationTime);
  if (
    !isWorking ||
    isCommitting ||
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
  }
  // 在某些生命周期函数中 setState 会造成无限循环
  // 这里是告知你的代码触发无限循环了
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    // Reset this back to zero so subsequent updates don't throw.
    nestedUpdateCount = 0;

  }
}

```
可以看到，如果这次更新可以正常进行的话（优先级够），则会进入 ```requestWork```

这是```requestWork```的方法体

```js
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  // 将 root 加入调度中
  addRootToSchedule(root, expirationTime);
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }
  // 判断是否需要批量更新
  // 当我们触发事件回调时，其实回调会被 batchedUpdates 函数封装一次
  // 这个函数会把 isBatchingUpdates 设为 true，也就是说我们在事件回调函数内部
  // 调用 setState 不会马上触发 state 的更新及渲染，只是单纯创建了一个 updater，然后在这个分支 return 了
  // 只有当整个事件回调函数执行完毕后恢复 isBatchingUpdates 的值，并且执行 performSyncWork
  // 想必很多人知道在类似 setTimeout 中使用 setState 以后 state 会马上更新，如果你想在定时器回调中也实现批量更新，
  // 就可以使用 batchedUpdates 将你需要的代码封装一下
  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    // 判断是否不需要批量更新
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, false);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  // 判断优先级是同步还是异步，异步的话需要调度
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    // 函数核心是实现了 requestIdleCallback 的 polyfill 版本
    // 因为这个函数浏览器的兼容性很差
    // 具体作用可以查看 MDN 文档 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
    // 这个函数可以让浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，
    // 而且不会对像动画和用户交互这样延迟敏感的事件产生影响
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}

```

无论是否批量更新已经是否同步更新，最终都会进入 ```performWorkOnRoot``` 方法。

这是 performWorkOnRoot 的方法体

```js
function performWorkOnRoot(
  root: FiberRoot,
  expirationTime: ExpirationTime,
  isYieldy: boolean,
) {
  invariant(
    !isRendering,
    'performWorkOnRoot was called recursively. This error is likely caused ' +
      'by a bug in React. Please file an issue.',
  );

  isRendering = true;

  // Check if this is async work or sync/expired work.
  if (!isYieldy) {
    // 不可打断任务
    // Flush work without yielding.
    // TODO: Non-yieldy work does not necessarily imply expired work. A renderer
    // may want to perform some work without yielding, but also without
    // requiring the root to complete (by triggering placeholders).
    // 判断是否存在已完成的 finishedWork，存在话就完成它
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      // 否则就去渲染成 DOM
      renderRoot(root, isYieldy);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        completeRoot(root, finishedWork, expirationTime);
      }
    }
  } else {
    // 可打断任务
    // Flush async work.
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime);
    } else {
      root.finishedWork = null;
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle;
      if (timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout;
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle);
      }
      renderRoot(root, isYieldy);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // We've completed the root. Check the if we should yield one more time
        // before committing.
        if (!shouldYield()) {
          // Still time left. Commit the root.
          completeRoot(root, finishedWork, expirationTime);
        } else {
          // There's no time left. Mark this root as complete. We'll come
          // back and commit it later.
          root.finishedWork = finishedWork;
        }
      }
    }
  }

  isRendering = false;
}
```

在这个方法中最重要的是会进入 *renderRoot* 方法， 这个方法会通过 *workLoop* 方法先向下遍历整个树，这个遍历会在到达叶子节点后向上回溯，下面会具体讨论这个遍历。

## workLoop 中的 ‘递’和‘归’

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

