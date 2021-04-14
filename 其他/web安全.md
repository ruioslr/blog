---
title: 其他
categories:
  - 其他 web安全
tags:
  - web安全
---

# web安全

## XSS

XSS（Cross Site Scripting）： 跨站脚本

XSS的类型：

- 存储型XSS
- 反射型XSS
- 基于DOM的XSS

### 存储型XSS

一般是采用表单的方式将恶意代码提交到服务端，然后用户访问页面时如果请求了包含恶意代码的数据，恶意代码会读取用户的cookie（document.cookie）等信息。


### 反射型XSS

一般是用户点击了某个链接，该链接会携带一些参数，而这些参数是恶意代码，服务端接收到这些参数后会返回给客户端，恶意代码便会执行。

### 基于DOM的XSS

在 Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据

### 如何阻止XSS

阻止XSS攻击，可以通过**阻止恶意Javascript脚本注入**和**阻止恶意脚本发送恶意消息**两个方面来实现：

- 服务器对用户输入进行过滤或转码
- 充分使用CSP（白名单机制）： 
  - 限制加载其他域的资源文件
  - 禁止向第三方发送数据
  - 禁止执行内联脚本和未授权的脚本
  - 上报机制
- Cookie使用HttpOnly

## CSRF

CSRF（Cross-Site request forgery）: 跨站请求伪造

## 什么是CSRF

**CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事**

**浏览器会把用户的cookie发送给对应的域**

当用户登录后，点击第三方链接，第三方链接会向你登录过的网站发起请求，此时浏览器会自动携带cookie


### 如何防止

- 使用Cookie的SameSite属性
  - 值为Strict，完全禁止第三方Cookie
  - 值为LAX， get方式不禁止，post方法会禁止携带Cookie，此外通过img，iframe的url的链接也会禁止携带Cookie
  - 值为None，完全不禁止第三方Cookie，即只要发起该网站的请求，都会携带Cookie
- 服务端验证请求的来源
  - 使用请求头的Referer和Origin属性
  - Origin 属性只包含了域名信息，并没有包含具体的 URL 路径，这是 Origin 和 Referer 的一个主要区别。
- 使用token而不是cookie
- 接口添加短信或图片验证






