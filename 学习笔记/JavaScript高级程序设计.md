---
title: JavaScript高级程序设计
categories:
  - 学习笔记
tags:
  - JavaScript JavaScript高级程序设计
---

# JavaScript 高级程序设计

## ECMAScript

ECMAScript，即 ECMA-262 定义的语言，并不局限于 Web 浏览器。事实上，这门语言没有输入和 输出之类的方法。ECMA-262 将这门语言作为一个基准来定义，以便在它之上再构建更稳健的脚本语言。 Web 浏览器只是 ECMAScript 实现可能存在的一种宿主环境（host environment）。 宿主环境提供 ECMAScript 的基准实现和与环境自身交互必需的扩展。扩展（比如 DOM）使用 ECMAScript 核心类型 和语法，提供特定于环境的额外功能。其他宿主环境还有服务器端 JavaScript 平台 Node.js 和即将被淘汰 的 Adobe Flash。

JavaScript 是一门用来与网页交互的脚本语言，包含以下三个组成部分。

- ECMAScript：由 ECMA-262 定义并提供核心功能。
- 文档对象模型（DOM）：提供与网页内容交互的方法和接口。
- 浏览器对象模型（BOM）：提供与浏览器交互的方法和接口。

## 基础知识

- script 标签
  **defer**: 不会阻塞 dom 渲染，立即下载，延迟执行（整个页面解析完成后再执行）, _多个脚本顺序执行_。defer 属性只对外部脚本有效，行内脚本会忽略这个属性。
  **async**: 同*defer*一样不会阻塞 dom 渲染，会立即下载脚本，但是会在下载完后立即执行，所以无法保证多个 async 脚本的执行顺序。行内脚本会忽略这个属性。

## JavaScript

## BOM

浏览器 url 跳转的三种方式：

- location.assign(url);
- location.href = url;
- window.location = url;

浏览器重新刷新：

- location.reload(); // 重新加载，可能是从缓存加载
- location.reload(true); // 重新加载，从服务器加载

::: tip
修改 location.pathname,location.search, location.hostname,location.port 都会使浏览器重新加载 url，而修改 licaiton.hash 不会。
通过 history.pushState()/replaceState()改变了 pathname,也不会是浏览器重新加载。
:::

### navigator 对象

navigator 对象的属性通常用于确定浏览器的类型。
通常通过 navigator.userAgent 判断浏览器标识。
navigator.plugins 返回浏览器安装的插件数组。

### screen 对象

保存着浏览器窗口外面的**客户端显示器**的信息。
eg: screen.width 屏幕的像素宽度。screen.height 屏幕像素高度。

### history 对象

history 对象表示当前窗口首次使用以来用户的导航历史记录。因为 history 是 window 的属性， 所以每个 window 都有自己的 history 对象。出于安全考虑，这个对象不会暴露用户访问过的 URL， 但可以通过它在不知道实际 URL 的情况下前进和后退。

history.go(number)方法可以前进和后退。

history.length 表示历史记录数。

#### history 状态管理

可以通过 history.pushState()/replaceState()改变浏览器历史状态，再点击后退按钮时，会触发 popstate 事件。
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

页面的根节点时**document**节点，其唯一子节点是`<html>`;

### Node 类型

*DOM Level 1*描述了名为**Node**的接口，这个接口是所有**DOM**节点类型都必须实现的。Node 接口在 JavaScript 中被实现为**Node 类型**，在除 IE 之外的所有浏览器中都可以直接访问这个类型。在 JavaScript 中，所有节点类型都继承 Node 类型，因此所有类型都共享相同的基本属性和方法。 每个节点都有 nodeType 属性，表示该节点的类型.

节点的*parentNode*指向父元素，*childNodes*是所有子节点组成的类数组。

### 操作节点的方法

- appendChild：向 childNodes 类数组里追加一个节点
- insertBefore: 向某个节点前插入一个节点
- replaceChild: 替换某个节点
- removeChild: 删除某个节点
- cloneNode: 复制节点，如果传入 true 的话，则会复制节点及其整个子 dom 树(不会复制 dom 的 js 事件）

### document 常用属性

- document.title 标题
- document.URL === location.href
- getElementByXXX 寻找 dom

## DOM 编程

- 动态加载 script

```js
// 外部脚本
function loadScript(url) {
  let script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}
// 内联脚本
function loadScript(code) {
  let script = document.createElement("script");
  try {
    script.appendChild(document.createTextNode(code));
  } catch (e) {
    script.text = code;
  }
  document.body.appendChild(script);
}
```

- 动态样式

外联样式：如动态创建**script**标签一样，**link**标签也可以动态创建，然后 append 到**head**标签中。
内联样式：动态创建**style**标签。

```js
// 外联
function loadStyles(url) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}

loadStyles("styles.css");

// 内联
function loadStyleString(css) {
  let style = document.createElement("style");
  style.type = "text/css";
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }
  let head = document.getElementsByTagName("head")[0];

  head.appendChild(style);
}

loadStyleString("body{background-color:red}");
```

- 类名操作

node.classList 上有多个操作类名的方法：
add();
remove();
contains();
同时，classList 可以被迭代。

### 焦点管理

**document.activeElement** 表示当前拥有焦点的 dom 元素。
**document.hasFocus()** 返回当前文档是否有焦点。

### HTMLDocument 扩展

- readyState

`document.readyState === 'loading'`表示文档正在加载，`document.readyState === 'complete'`表示加载完成。

- innerHTML 和 outerHTML

两者都会放回 dom 字符串，但前者不包括调用的 dom 本身，而后者会包括。

## DOM2 和 DOM3

DOM3 新增比较节点的两个方法

- isSameNode()
- isEqualNode()

当两个节点是同一个对象时，`isSameNode() === true`, 当两个节点的类型相同，且属性、attributes、childNodes 都相同时`isEqualNode() === true`

DOM3 也增加了给 DOM 节点附加额外数据的方法

- setUserData()

```js
document.body.setUserData("name", "Nicholas", function() {});
let value = document.body.getUserData("name"); // 'Nicholas'
```

**setUserData()**的处理函数会在包含数据的节点被复制、删除、重命名或导入其他文档的时候执 行，可以在这时候决定如何处理用户数据。处理函数接收 5 个参数：表示操作类型的数值（1 代表复制， 2 代表导入，3 代表删除，4 代表重命名）、数据的键、数据的值、源节点和目标节点。删除节点时，源 节点为```null```；除复制外，目标节点都为```null```。

```js
let div = document.createElement("div");
div.setUserData("name", "Nicholas", function(operation, key, value, src, dest) {
  if (operation == 1) {
    dest.setUserData(key, value, function() {});
  }
});

let newDiv = div.cloneNode(true);
console.log(newDiv.getUserData("name"));// "Nicholas"
```

iframe的相关属性

- contentDocument
- contentWindow

```js
const iframe = document.getElementById("myIframe");
const iframeDoc = iframe.contentDocument;
const iframeWindow = iframs.contentWindow;
```

### 样式

document.defaultView.getComputedStyle(): 返回计算后的样式
```js
let myDiv = document.getElementById("myDiv");
let computedStyle = document.defaultView.getComputedStyle(myDiv, null);
```

  

## 模块

将代码拆分成独立的块，然后再把这些块连接起来可以通过模块模式来实现。这种模式背后的思想 很简单：把逻辑分块，各自封装，相互独立，每个块自行决定对外暴露什么，同时自行决定引入执行哪 些外部代码。不同的实现和特性让这些基本的概念变得有点复杂，但这个基本的思想是所有 JavaScript 模块系统的基础。

### IIFE

IIFE(Immediately Invoked Function Expression): ）将模块定义封装在匿名闭包中.

```js
var Foo = (function() {
  return {
    bar: "baz",
    baz: function() {
      console.log(this.bar);
    },
  };
})();

console.log(Foo.bar); // 'baz'
Foo.baz(); // 'baz'
```

### CommonJS

主要使用在服务器端 Nodejs。

```js
var moduleB = require('./moduleB');

module.exports = { stuff: moduleB.doStuff(); };
```

- 模块的加载是同步的。
- 模块第一次加载后会被缓存，后续加载会取得缓存的模块。所以模块的代码只会执行一次。

### 异步模块定义（AMD）

这是定义 AMD 模块的方式。

```js
define('moduleA', ['moduleB'], function(moduleB) {
    return {
        stuff: moduleB.doStuff();
    };
});
```

同时，也支持使用**require**和**export**来定义 commonjs 风格的模块

```js
define("moduleA", ["require", "exports"], function(require, exports) {
  var moduleB = require("moduleB");

  exports.stuff = moduleB.doStuff();
});
```

### 通用模块定义（UMD）

UMD 是用来统一 Commonjs 和 AMD 的方案。

```js
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD。注册为匿名模块
    define(["moduleB"], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node。不支持严格 CommonJS
    // 但可以在 Node 这样支持 module.exports 的 // 类 CommonJS 环境下使用
    module.exports = factory(require(" moduleB "));
  } else {
    // 浏览器全局上下文（root 是 window）
    root.returnExports = factory(root.moduleB);
  }
})(this, function(moduleB) {
  // 以某种方式使用 moduleB

  // 将返回值作为模块的导出
  // 这个例子返回了一个对象
  // 但是模块也可以返回函数作为导出值
  return {};
});
```

UMD 的实现是通过一个 IIFE 包裹逻辑，判断当前环境是 Commonjs 或 AMD 环境，并做处理，如果既不是 Commonjs 也不是 AMD 环境，则将模块挂载在全局对象（window）上。

### ES6 Module

- 带有 type="module"属性的`<script>` 标签会告诉浏览器相关代码应该作为模块执行，而不是作为传统的脚本执行.
- 所有模块都会像`<script defer>`加载的脚本一样按顺序执行.
- 同一个模块无论在一个页面中被加载多少次，也不管它是如何加载的，实际上都只会加载一次.

#### 模块行为

- 模块代码只在加载后执行
- 模块只能加载一次
- 模块是单例
- 模块可以定义公共接口，其他模块可以基于这个公共接口观察和交互
- 模块可以请求加载其他模块
- 支持循环依赖

#### ES6 模块额外特性

- ES6 模块默认在严格模式下执行
- ES6 模块不共享全局命名空间
- 模块顶级 this 的值是 undefined(常规脚本中是 window)
- 模块中的 var 声明不会添加到 window 对象
- ES6 模块是异步加载和执行的

## Worker

使用工作者线程，浏览器可以在原始页面环境之外再分配一个完全独立的二级子环境。这个子环境 不能与依赖单线程交互的 API（如 DOM）互操作，但可以与父环境并行执行代码。
