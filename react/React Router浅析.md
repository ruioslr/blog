---
title: React Router 浅析
categories:
 - React
tags:
 - React
 - React Router
---

# React Router 浅析

## history

history 是一个加强的window.history库，主要有以下几点增强：

* match

```js
match: {
    path: "/", // 用来匹配的 path
	url: "/", // 当前的 URL
	params: {}, // 路径中的参数
	isExact: pathname === "/" // 是否为严格匹配
}
```

* location 

来源自window.location对象

```js
hash: "" // hash
key: "nyi4ea" // 一个 uuid
pathname: "/explore" // URL 中路径部分
search: "" // URL 参数
state: undefined // 路由跳转时传递的 state
```

