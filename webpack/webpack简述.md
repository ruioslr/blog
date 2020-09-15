---
title: Webpack 简述
categories:
 - webpack
tags:
 - webpack
---

# Webpack 简述


## 什么是webpack

webpack 是现阶段非常流行的**静态模块打包器**。

## 核心概念

* 入口
* 输出
* loader
* plugin

## 入口

入口（entry）是webpack构建依赖树的起点，webpack会从入口开始找出所有的依赖。

**webpack.config.js**
``` js
module.exports = {
  entry: './src/index.js'
};
```
## 输出

输出（output）属性指定webpack将打包好的bundles输出到哪个目录，以及如何命名。
**webpack.config.js**
``` js
module.exports = {
  output: {
      path: path.resolove(__dirname, ./dist),  // 绝对路径
      pubicPath: 'https: oss.ali.xxxx', // 静态资源路径
      filename: '[name].[chunkname].js',
  }
};
```
## loader

loader 是webpack的预加载器，webpack原生只对js，和json文件提供支持，而loader的作用是让webpack其他非js模块解析。

**webpack.config.js**
``` js
module.exports = {
  module:{
      rules: [
          {
              test: /.(css|less)$/,
              use: ['style-loader', 'css-loader', {
                  loader: 'less-loader',
                  options: {
                      ///
                  }
              }],
          }
      ]
  }
};
```

## 插件

插件 提供webpack的构建后处理能力。

**webpack.config.js**
``` js
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
    ],
};
```



