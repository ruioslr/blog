---
title: Webpack Loader开发
categories:
 - webpack
tags:
 - webpack
---

# Webpack Loader开发

## 什么是loader

loader是将各种资源处理成js模块。

### loader的产物
loader的产物是js模块

比如，图片会使用file-loader或者raw-loader，会通过`emitFile`将图片复制到公共目录，然后生成一个js模块：
```js

const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
```

## 什么是plugin

plugin是在 Webpack 构建生命周期的特定“事件”发生时，执行预设的逻辑。(其实就是tap各种事件【hooks】)；

plugin是一个有apply熟悉的类；
```js

class MyPlugin {
    construct() {
        
    }
    
    apply(){
        
    }
}
```

### plugin 的产物
plugin的产物有多种，具体取决于plugin的功能

### compiler 和 compilation

- compiler 是整个生命周期
- compilation 是一个构建周期，比如watch模式，每次变更都会产生一个新的compilation
