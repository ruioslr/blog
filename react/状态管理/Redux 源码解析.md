---
title: Redux 源码解析
categories:
 - 状态管理
tags:
 - Redux
 - 源码
---

# Redux 源码解析

## Redux 中间件实现原理

react中间件是一个洋葱模型

实现两个简单的log中间件

```js

const log1 = store => next => action => {
    console.log('log1 start');
    next(action);
    console.log('log1 end');
}

const log2 = store => next => action => {
    console.log('log2 start');
    next(action);
    console.log('log2 end');
}

// log1 start
// log2 start
// log2 end
// log1 end
```

### 什么是中间件

redux中间件是对store.dispatch进行了增强。中间件的本质是一个三层函数，第一层的参数是{getState, dispatch}, 第二层的参数是next,对下一个中间件函数的引用，第三层参数是action。

### 中间件实现

```js
    // applymiddlewar 部分源码
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)
```

可以看到，先使用map函数，将中间件函数调用，并传入{getState，dispatch}，使得中间件函数变成两层函数。

```js
// map调用之后的中间件变成下面的样子

next => action => {...}

```

接着调用```compose```方法,这是compose的源码：

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```

先说说reduce方法，**它最后的返回值是数组的最后一项被执行后的结果**， 所以```funcs.reduce((a, b) => (...args) => a(b(...args)))```这一行最后返回的是一个```(...args) => fn1(fn2(fn3(...args)))```。


::: tip
reduce 的返回值是最后一项执行的操作之后的返回值，所以，reduce的返回值的类型一定与reduce的回调函数的返回值类型是一样的;

```js
[1,2,3].reduce((pre, item) => pre + item); // 返回值类型是number

[() => 1， () => 2, () => 3].reduce((pre, item) => (...args) => pre(item(...args))); // 返回类型是funtion， 数组中的三个函数从右往左调用

```

::: tip

再来看看如何用reduce实现洋葱模型

```js
const dispatchEnhancer = [
    next => () => {console.log('func1 start'); console.log(next.toString()); next(); console.log('func1 end')},
    next => () => {console.log('func2 start'); console.log(next.toString()); next(); console.log('func2 end')},
    next => () => {console.log('func3 start'); console.log(next.toString()); next(); console.log('func3 end')}
].reduce((pre, item) => (...args) => pre(item(...args)))

const dispatchAfterEnhancer = dispatchEnhancer(dispatch);

function dispatch () {
    console.log('dispatch')
}

dispatchAfterEnhancer();

// 输出

// func1 start
// func2 start
// func3 start
// dispatch
// func3 end
// func2 end
// func1 end

```



