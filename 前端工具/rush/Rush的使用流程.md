---
title: Rush的使用流程
categories:
 - 构建工具
tags:
 - rush
 - 构建工具
---

# Rush的使用流程

## monorepo场景

需要在```rush.json```中配置```projects```字段,指定repo

- 安装公共包： 可以直接在需要安装的项目下，```rush add -p <package>```
- 公共包修改后：
```shell
// 先将修改的代码提交到git
git commit -m "update package"
// 生成/更新 一个带有版本变化的json文件
rush change
// 生成/更新Changelog 更新自己的package.json 的version, 以及更新依赖该包的项目的package.json里的version
rush pushlish --apply

// 后面可以用  pnpm pushlish 发布 -_- ,不知道为什么rush pusblish --pushlish 没效果

```

::: tip
项目里的```version: workspace:xxx```  在发布到npm时，会替换成正常的版本号，这是```workspace协议```
暂时还不清楚是不是pnpm独有的协议-_-
::: 
