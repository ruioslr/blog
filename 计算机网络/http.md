---
title: HTTP
categories:
  - 计算机网络
tags:
  - 计算机网络
---

# HTTP

## HTTPS

https 是在 TCP 和 HTTP 两层之间添加了一层**TLS/SSL**安全层，对**数据进行对称加密**，对**对称加密秘钥**进行**非对称加密**。

## HTTPS 连接过程

1，TCP 三次握手
2，client 生成并发送 client-random 和支持的算法集合给服务端
3，服务端选择一个加密算法，生成 server-random，然后返回选择的加密算法+server-random+https 证书（证书包含公钥）
4，client 验证证书合法性，通过 client-random 和 server-random 生成 pre-master，通过公钥发送给服务端。
5，服务端收到 pre-master,用私钥解密后，通过 3 中选择的算法生成 master-secret。
6，client 以 5 中同样的算法生成 master-secret，然后客户端和服务端使用 master-secret 对称加密和解密。

## HTTP2.0

### http 的发展历程

- http 1.0
- http 1.1
  - 增加 Keep-Alive ，多个 Http 可以使用同一个 TCP（默认允许一个域名同时建立 6 个 TCP 长链接）
  - 依然存在的问题： 队头阻塞， 即，TCP 中的 http 是串行的，前面的请求是阻塞后面的请求
- http 2.0
  - 多路复用：（本质是使串行的 http 请求可以并行）
    - 添加二进制分帧层， 将请求分帧，同一个请求的帧具有相同的 ID，接收方根据 ID 再合成请求
  - 请求优先级
    - 一般： html > css > js > 图片字体等静态资源
  - 服务端推送
    - 服务器可以对一个客户端请求发送多个响应， 比如一个 html 的请求会响应 html 和它需要的 css，js 等资源
  - 首部压缩
    - 通讯双方各自缓存一份头部字段表，减少字段传输
    - 使用索引表来定义常用的 http Header （空间换时间）
