---
title: React 组件何时执行Render
categories:
 - React
tags:
 - React
---

# React 组件何时执行Render

这篇文章主要是记录React 组件会执行render方法的条件（函数组件执行方法体，类组件执行render方法）。

看到以下代码：

```js

const Parent = (props) => {

    const [count, setCount] = useState(0);

    console.log('parent render');

    return (<div>
        {count}
        {props.children}
        <button onClick={() => setCount(count => count + 1)}>点击Parent</button>
    </div>);
}

const Child3 = (props) => {
    console.log('child3 render');
    return <div>Child3</div>
}

const Child4 = React.memo((props) => {
    console.log('child4 render');
    return <div>Child4</div>
})

const App = () => {
  const Child1 = () => {
    console.log("child1 render");
    return (
        <div>这是子组件1</div>
    );
  };

  const Child2 = () => {
    console.log("child2 render");
    return (
      <div>这是子组件2</div>
    );
  };

  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <span>this is my app</span>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>点击APP</button>
      </div>
      <Child1 />
      {Child2()}
      <Parent>
        <Child3/>
        <Child4/>
      </Parent>
    </div>
  );
};


```

在上述代码中，有四个子组件，分别是Child1,Child2,Child3,Child4：
- 1, 页面加载后会分别输出:
```
child2 render
child1 render
parent render
child3 render
child4 render

即： 四个子组件的函数体都被执行。
```
- 2, 当点击**点击APP**按钮时，控制台打印：
```
child2 render
child1 render
parent render
child3 render

即： child4没执行函数体
```
- 3， 当点击**点击Parent**时，控制台输出```parent render```，即： 4个child都没执行函数体。

下面，来对这3个情况具体分析：

## 四个子组件的函数体都被执行。

这种情况是因为页面首次加载，所以所有组件都需要render,不需要讨论。

## child4没执行函数体

为什么child4没有re-render呢？

首先，React创建Fiber树时，对每个组件创建Fiber的逻辑：
- render: 调用函数体或类组件的render方法，根据生成的**ReactElement**（jsx编译后变成React.creatElement(),这个方法生成ReactElement）,与old fiber比较生成新的fiber.
- bailout:在**同时**满足以下条件时，直接跳过，复用之前的fiber。这样组件就不会re-render, （源码对应```beginWork```的前面逻辑）。
  - 1, oldProps === newProps
  - 2, context 没有变化
  - 3，workInprogress.type === current.type， 可认为是组件类型没变化
  - 4，!includesSomeLane(renderLanes, updateLanes) ， 即：这个组件上有没有产生更新

再来看看具体情况：当**点击App**按钮被点击时，App组件会产生更新，并开始re-render, **Child1**会生成新的**ReactElement**其props发生改变（生成新的props,如果没有props,则前后都两个地址不相等的```{}```），所以Child1会re-render,**如果将 1，Child1使用React.memo包裹（这样oldProps === newProps 这个条件，会变成新旧props的浅比较是否相同），然后：2，放在App组件外声明，或者使用useCallback包裹。则Child1不会re-render** 对于**Child2**,它并不是一个react组件，而是函数调用，所以每次App组件的render都会执行Child2,对与Child3和Child4, 同Child1一样，由于Child4使用React.memo包裹，所以不会re-render。

## 4个child都没执行函数体

当**点击Parent**按钮被点击时，由于react会从**rootFiber**开始更新，**rootFiber**前后props都是```null```,满足```oldProps === newProps```和其它三个条件,所以返回的**App组件**的Fiber直接复用，所以对于App组件，其新老props都是```{children: ...}```(这里两个{}是同一个对象),满足```oldProps === newProps```和其它三个条件，也会复用，即**不会执行App的render方法**，所以**Child2**不会执行，对于**Child1**和**App组件**一样,前后props都是**{children: ...}**,且满足其它三个条件。来到**Parent组件**，虽然其props都是```{children: ...}```但是其不满足第4个条件，所以会重新执行方法体，于是输出```parent render```,再看**Child3和Child4**,由于Parent组件的props没有变，其```props.children```中**Child3**和**Child4**的fiber都会复用，所以也会满足四个条件，所以他们不会很执行函数体，所以： **如果把parent中的props.children换成<Child3 /><Child4 />  的形式，则会调用他们的方法体**。


