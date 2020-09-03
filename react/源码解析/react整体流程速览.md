# React 整体流程速览

## React15架构
* Reconciler
* Renderer

## React16架构
* Scheduler 
* Reconciler
* Renderer

**带来的更新：**  1，新添加了Scheduler层。2，Reconciler 变成了 Fiber Reconciler，之前的Reconiler是与Renderer交替执行，现在变为在Reconiler阶段为虚拟DOM打上标记，然后统一在Renderer层更新。

## Mount 
``` js
ReactDOM.render(<App/>, document.getElementById('root'));
```
react 会在首次渲染时，创建 *FiberRoot* 和 *RootFiber*,其中*FiberRoot*是整个应用的根节点，而*RootFiber* 是当前组件树的根节点。*FiberRoot.current === RootFiber*
