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
- StrictMode下，开发环境，useEffect会走两次

- ssr相关
  - RSC组件，react server componet
  - 流式ssr
  - reactdom.createHydrateRoot()

流式ssr的过程： 用户请求 -> 执行RSC组件代码，碰到需要获取数据的RSC组件先渲染suspence的fallback -> 使用renderToPipeableStream返回


nextjs中appRoute和pageRoute的区别：
- page： 
  - 全量ssr
- app：
  - 增量ssr，通过react18的RSC和流式ssr特性实现，先返回所有服务端组件，如果需要异步等待，则返回loading，等待数据完成，服务端会推送新的html字符串，如果包含客户端组件，则会重新水合。

流式ssr的原理：
  - 利用http的流式传输，需要设置响应头res.setHeader('Transfer-Encoding', 'chunked'); // 关键：开启分块传输

approute优点：减少服务端响应时间，减少客户端请求js代码体积。