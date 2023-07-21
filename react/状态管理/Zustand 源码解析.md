---
title: Zustand 源码解析
categories:
 - 状态管理
tags:
 - Zustand
 - 源码
---

# Zustand 源码解析



## useSyncExternalStoreWithSelector 和 useSyncExternalStore

`useSyncExternalStore` 这个hook是 React 专门给状态管理开发者使用的hook，它的作用是将外部的状态管理库和 React 的状态管理库进行同步；

` useSyncExternalStoreWithSelector ` 是它的增加了选择器的版本

### 参数
 - `subscribe`: 一个函数，react在调用它的时候，传入一个callback，在Zustond 的store发生变化的时候，需要调用这个callback触发react `re-render`，`useSyncExternalStore`在小于`react18`的版本中shim采用的更新方式是`forceUpdate`
 - `getSnapshot`: 一个函数，调用时会返回stroe的引用
 - `getServerSnapshot`： 一个函数(可选)，服务端渲染使用

  ***useSyncExternalStoreWithSelector 增加了两个参数：***
 - `selector`: 一个函数，用来选择store中的局部数据
 - `equalityFn`: 一个函数，告诉如何比较

## 实现逻辑

### createStore

```ts

// createStoreImpl

const createStoreImpl: CreateStoreImpl = (createState) => {
  type TState = ReturnType<typeof createState>
  type Listener = (state: TState, prevState: TState) => void
  let state: TState
  const listeners: Set<Listener> = new Set()

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: TState) => TState)(state)
        : partial
    if (!Object.is(nextState, state)) {
      const previousState = state
      state =
        replace ?? typeof nextState !== 'object'
          ? (nextState as TState)
          : Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState: StoreApi<TState>['getState'] = () => state

  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener)
    // Unsubscribe
    return () => listeners.delete(listener)
  }

  const destroy: StoreApi<TState>['destroy'] = () => {
    if (import.meta.env?.MODE !== 'production') {
      console.warn(
        '[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.'
      )
    }
    listeners.clear()
  }

  const api = { setState, getState, subscribe, destroy }
  state = createState(setState, getState, api)
  return api as any
}

```

- 1, 定义state保存state值，listeners保存监听器
- 2, 提供setState，getState，subscribe，destroy四个方法用来操作state和listeners

### useStore

```ts
export function useStore<TState, StateSlice>(
  api: WithReact<StoreApi<TState>>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  )
  useDebugValue(slice)
  return slice
}

```
调用`useSyncExternalStoreWithSelector`，当其它地方调用`store.setState` 改变状态值时，通知 **react** `re-render`


## 中间件

Zustand的中间件：

```ts
(...args) => (set, get, api) => store
```

Zustand的中间件本质来说就是在对api进行修改：
- 增加api里的方法，如redux中间件，增加dispatch方法
- 重写api里的方法，如immer中间件，重写setState方法， subscribeWithSelector中间件，重写subscribe方法


### redux中间件

```ts
const reduxImpl: ReduxImpl = (reducer, initial) => (set, _get, api) => {
  type S = typeof initial
  type A = Parameters<typeof reducer>[1]
  ;(api as any).dispatch = (action: A) => {
    ;(set as NamedSet<S>)((state: S) => reducer(state, action), false, action)
    return action
  }
  ;(api as any).dispatchFromDevtools = true

  return { dispatch: (...a) => (api as any).dispatch(...a), ...initial }
}
```


### immer中间件

```ts
const immerImpl: ImmerImpl = (initializer) => (set, get, store) => { 
  type T = ReturnType<typeof initializer>

  store.setState = (updater, replace, ...a) => {
    const nextState = (
      typeof updater === 'function' ? produce(updater as any) : updater
    ) as ((s: T) => T) | T | Partial<T>

    return set(nextState as any, replace, ...a)
  }

  return initializer(store.setState, get, store)
}
```

### subscribeWithSelector中间件

```ts
const subscribeWithSelectorImpl: SubscribeWithSelectorImpl =
  (fn) => (set, get, api) => {
    type S = ReturnType<typeof fn>
    type Listener = (state: S, previousState: S) => void
    const origSubscribe = api.subscribe as (listener: Listener) => () => void
    api.subscribe = ((selector: any, optListener: any, options: any) => {
      let listener: Listener = selector // if no selector
      if (optListener) {
        const equalityFn = options?.equalityFn || Object.is
        let currentSlice = selector(api.getState())
        listener = (state) => {
          const nextSlice = selector(state)
          if (!equalityFn(currentSlice, nextSlice)) {
            const previousSlice = currentSlice
            optListener((currentSlice = nextSlice), previousSlice)
          }
        }
        if (options?.fireImmediately) {
          optListener(currentSlice, currentSlice)
        }
      }
      return origSubscribe(listener)
    }) as any
    const initialState = fn(set, get, api)
    return initialState
  }
```