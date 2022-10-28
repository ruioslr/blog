---
title: React 18 新特性
categories:
  - React
tags:
  - React
---

# react 18 新特性

- Render API
  - ReactDom.createRoot().render()
- 自动批处理
  - flushSycn 阻止批处理
- Suspense 不再跳过 fallback
- 新的 hooks
  - useId
  - useSyncExternalStore
  - useInsertionEffect
  - useEvent ? 没看到
- Concurrent Mode
  - startTransiton 包裹 useState 的 dispatch，将它标记为低优先级的更新
  - useDeferredValue 和 startTransiton 一样，不过它是产生一个低优先级的值
