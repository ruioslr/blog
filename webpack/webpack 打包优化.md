---
title: Webpack 优化
categories:
  - webpack
tags:
  - webpack
---

# Webpack 优化

## 构建时间优化

- 开启多进程打包 thread-loader
- 优化 resolve 配置
  - modules , includes, exculdes， 减少 webpack 解析范围
- 缓存，dll，cache-loader， webpack5 自带 无需配置

## 构建体积优化

- js 压缩
- css 压缩 css-minimizer-webpack-Plugin 开发
- 使用 import 语法资源懒加载
- 抽离公共依赖
- css 文件分离 minicssExtractPlugin
