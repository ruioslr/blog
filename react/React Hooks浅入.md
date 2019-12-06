# React Hooks 浅入

## 什么是Hooks

Hook 是React 16.8中新增的特性，本质来说，Hook其实就是函数组件，但是与普通函数式组件不同，在hook中可以使用state等类组件才拥有的特性。

## Hooks有什么用

* 复用逻辑
* 分离关注

### 复用逻辑

以往复用组件和业务逻辑的方式通常是 **高阶组件（HOC）** 和 **Render Props** ,这两种方式确实也很有用，并且许多框架和库中都使用它们来封装公共逻辑，但是这两种方式在使用时都会在原来的组件外层再包裹一层组件，会导致组价层级越来越多，组件代码越来越不可读；使用hook来封装公共逻辑可以有效的解决这些问题。

### 分离关注

首先看看这段伪代码:
``` js
class Module extends React.Component{
    componentDidMount() {
        // do ajax 
        // init something
        // subscribe something
    }

    componentDidUpdate() {
        // do ajax
        // do otherthing
    }

    componentWillUnmount() {
        // unsubseribe something
        // clear timing
    }
}
```

我们往往会在类组件的didMount生命周期里聚合很多逻辑代码，例如请求后台接口，初始化一些东西，订阅某个更新，然后在didUpdate里重复，最后在willUnmount里做关闭订阅等清理工作。这样在业务复杂的场景会导致组件越来越难以复用，而在hook中，只需要 使用 **useEffect** 即可：

``` ts
const Module: React.FC<any> = props => {
    useEffect(() => {
        // do ajax
    },['some props']);

    useEffect(() => {
        // do subscribe
        return () => {
            // do unsubscribe
        }
    },['subscribe']);

    useEffect(() => {
        // do otherthing
    });
}
```

## 常用Hook

### useEffect

useEffect 的作用相当于 componentDidMount, componentDidUpdate, componentWillUnmount这三个生命周期的集合，其第一个参数是要执行的回调函数；第二次参数是依赖数组，当不传时，会在每一次render（对于函数组件，render即函数重新执行）**后**都执行，所以需要传入依赖以。

### useState

useState 的作用是让函数组件像类组件一样拥有状态，用法很简单： ``` const [state1, setState1] = useState(initValue) ``` state的值可以是js的任意类型。

### useMeme, useCallback

这两个hook都是优化层面上的功能hook，配合React.memo,可以对组件进行props的浅比较。useMemo 是对 值（第一个参数也是函数，函数的返回值缓存）进行memorize，而useCallback 是对整个函数。

### useContext

作用是为函数组件提供访问Context的能力， 参数是Context **对象本身**，而非Context.Consumer

### useRef

作用是提供对子组件或标签的ref引用

### useLayoutEffect

函数签名与useEffect相同，区别在于useLayoutEffect会在所有Dom变更完成后同步调用，而useEffect会在Dom变更后延迟调用。

## 自定义hook

自定义Hook 是一个以use开头（只是一个约定），并且调用了其他hook的函数。用来封装一些公用逻辑。每次hook的调用都有一个完全独立的state，所以可以多次调用。

封装自定义hook 就像封装一个函数一样，将通用状态代码封装成一个函数。

