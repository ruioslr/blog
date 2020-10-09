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
浏览器url跳转的三种方式：
* location.assign(url);
* location.href = url;
* window.location = url;


浏览器重新刷新：
* location.reload(); // 重新加载，可能是从缓存加载 
* location.reload(true); // 重新加载，从服务器加载

::: tip
修改location.pathname,location.search, location.hostname,location.port 都会使浏览器重新加载url，而修改licaiton.hash不会。
通过history.pushState()/replaceState()改变了pathname,也不会是浏览器重新加载。
:::

### navigator 对象

navigator 对象的属性通常用于确定浏览器的类型。
通常通过navigator.userAgent判断浏览器标识。
navigator.plugins返回浏览器安装的插件数组。


### screen 对象

保存着浏览器窗口外面的**客户端显示器**的信息。
eg: screen.width 屏幕的像素宽度。screen.height 屏幕像素高度。

### history 对象

history 对象表示当前窗口首次使用以来用户的导航历史记录。因为 history 是 window 的属性， 所以每个 window 都有自己的 history 对象。出于安全考虑，这个对象不会暴露用户访问过的 URL， 但可以通过它在不知道实际 URL 的情况下前进和后退。

history.go(number)方法可以前进和后退。

history.length表示历史记录数。

#### history状态管理

可以通过history.pushState()/replaceState()改变浏览器历史状态，再点击后退按钮时，会触发popstate事件。
::: tip
使用 HTML5 状态管理时，要确保通过 pushState()创建的每个“假”URL 背后都对应着服务器上一个真实的物理 URL。否则，单击“刷新”按钮会导致 404 错误。所有单页应用程序（SPA，Single Page Application）框架都必须通过服务器或客户端的某些配置解决这个问题。
:::

## 客户端检测


```js
// IE5 之前的版本中没有 document.getElementById() 这个 DOM 方法， 但可以通过 document.all 属性实现同样的功能。为此，可以进行如下能力检测：
function getElement(id) {
    if (document.getElementById) { 
        return document.getElementById(id); 
    } else if (document.all) {
        return document.all[id]; 
    } else {
        throw new Error("No way to retrieve element!");
    }
}
```
::: tip 
应该先检测最常用的方式
:::

## DOM

页面的根节点时**document**节点，其唯一子节点是```<html>```;

### Node 类型

*DOM Level 1*描述了名为**Node**的接口，这个接口是所有**DOM**节点类型都必须实现的。Node接口在JavaScript中被实现为**Node 类型**，在除 IE 之外的所有浏览器中都可以直接访问这个类型。在 JavaScript中，所有节点类型都继承 Node 类型，因此所有类型都共享相同的基本属性和方法。 每个节点都有 nodeType 属性，表示该节点的类型.

节点的*parentNode*指向父元素，*childNodes*是所有子节点组成的类数组。

### 操作节点的方法

* appendChild：向childNodes类数组里追加一个节点
* insertBefore: 向某个节点前插入一个节点
* replaceChild: 替换某个节点
* removeChild: 删除某个节点
* cloneNode: 复制节点，如果传入true的话，则会复制节点及其整个子dom树(不会复制dom的js事件）

### document 常用属性

* document.title 标题
* document.URL === location.href
* getElementByXXX 寻找dom

## DOM 编程











