---
title: HTTPS
categories:
  - 计算机网络
tags:
  - 计算机网络
---

# HTTPS

## 什么是HTTPS

https 是在TCP和HTTP两层之间添加了一层**TLS/SSL**安全层，对**数据进行对称加密**，对**对称加密秘钥**进行**非对称加密**。

## HTTPS连接过程

1，TCP三次握手
2，client生成并发送client-random和支持的算法集合给服务端
3，服务端选择一个加密算法，生成server-random，然后返回选择的加密算法+server-random+https证书（证书包含公钥）
4，client验证证书合法性，通过client-random和server-random生成pre-master，通过公钥发送给服务端。
5，服务端收到pre-master,用私钥解密后，通过3中选择的算法生成master-secret。
6，client以5中同样的算法生成master-secret，然后客户端和服务端使用master-secret对称加密和解密。