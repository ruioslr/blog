---
title: JavaScript高级程序设计
categories:
 - 学习笔记
tags:
 - JavaScript JavaScript高级程序设计
---

# JavaScript高级程序设计

## ECMAScript

ECMAScript，即 ECMA-262 定义的语言，并不局限于 Web 浏览器。事实上，这门语言没有输入和 输出之类的方法。ECMA-262 将这门语言作为一个基准来定义，以便在它之上再构建更稳健的脚本语言。 Web 浏览器只是 ECMAScript 实现可能存在的一种宿主环境（host environment）。 宿主环境提供 ECMAScript 的基准实现和与环境自身交互必需的扩展。扩展（比如 DOM）使用 ECMAScript 核心类型 和语法，提供特定于环境的额外功能。其他宿主环境还有服务器端 JavaScript 平台 Node.js 和即将被淘汰 的 Adobe Flash。

JavaScript 是一门用来与网页交互的脚本语言，包含以下三个组成部分。 
*  ECMAScript：由 ECMA-262 定义并提供核心功能。 
*  文档对象模型（DOM）：提供与网页内容交互的方法和接口。 
*  浏览器对象模型（BOM）：提供与浏览器交互的方法和接口。


## 基础知识

* script 标签
**defer**: 不会阻塞dom渲染，立即下载，延迟执行（整个页面解析完成后再执行）, *多个脚本顺序执行*。defer属性只对外部脚本有效，行内脚本会忽略这个属性。
**async**: 同*defer*一样不会阻塞dom渲染，会立即下载脚本，但是会在下载完后立即执行，所以无法保证多个async脚本的执行顺序。行内脚本会忽略这个属性。

## JavaScript

## BOM

