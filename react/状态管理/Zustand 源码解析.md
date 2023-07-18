---
title: Zustand 源码解析
categories:
 - 状态管理
tags:
 - Zustand
 - 源码
---

# Zustand 源码解析



## useSyncExternalStoreWithSelector

```useSyncExternalStoreWithSelector``` 这个hook是 React 专门给状态管理开发者使用的hooks，它的作用是将外部的状态管理库和 React 的状态管理库进行同步，

