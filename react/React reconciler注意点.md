---
title: React reconciler注意点
categories:
 - React
tags:
 - React
---

# React reconciler注意点


## reconcile

这里只说reconcileChildren阶段：

在beginWork时，根据newChild（执行函数体，或render方法得到）生成Children对应的WorkInProgress,然后返回第一个ChildWorkInProgress,继续beginWork.

## re-render

re-render指的是class组件执行render方法或者functional组件执行函数体。

只有在以下情况全部满足时，才不会re-reder:
- current.memoizedProps === workInProgress.pendingProps, 其中workInProgress.pendingProps的来源是**ReactElement.props**，如果它的父级没有re-render,那么ReactElement不会重新由React.createElement生成，这个条件就一定会成立
- !includesSomeLane(renderLanes, updateLanes)，即是否产生更新
- 组价type是否发生变化， 即div -> p, 或者组件的引用发生变化
- context是否变化

## dom重新加载

会导致dom重新加载的原因是**对应位置（对应key,没有key则是index）**的type发生变化。因为在reconciler这个fiber时，如果type变化，则直接创建新的fiber，这个fiber的stateNode === null。

::: tips
发送dom重载的节点其子节点都会重载
::: 

## bailout

字面意思就是跳过。实际就是，跳过它的beginWork阶段，在其**子节点**没有产生更新的情况下，会**连同**子节点一起跳过

当组件不发生re-render其实就是走了bailout,所以上面不走re-render的条件就是bailout的条件。下面主要说明bailout干了什么。

bailout发生在beginWork的过程中，能够进入bailout方法，说明：
- 1，这个组件的类型没有改变，生成的WorkInProgress是根据它上一次渲染的fiber来的，其stateNode与上次渲染一致。
- 2，它的父级一定没有re-render，因为它的props和原来一样，所以没有执行React.createElement。
- 3，如果子节点没有更新，则它的子节点会一并跳过。

## 几个结论

- 1，组件type发生变化，会导致组件的re-render和其dom重载，这是必然的，因为重载肯定要执行render生成ReactElement。
- 2，组件重载会导致**输入框失去焦点**，**图片闪烁**等。在排查时看起上级或更上级type发生变化，且**引用问题**居多。
- 3，最上层产生更新的节点，其**前后props相等**。因为它是最上层的更新，所以它的父级没有更新，会bailout,而不会re-render,因而这个节点的element不需要重新使用React.createElement生成。
- 4，最上层产生更新的节点，**其所有子节点都会re-render**。因为它的所有节点都会执行React.createElement。
- 5，对于4，有一种特例不会re-render： 使用**props.children**的子节点。因为结论3中提到props不会变，所以props.children也不会变，**props.children已经是React.Element，而不是jsx标签，不需要在执行React.createElement**.