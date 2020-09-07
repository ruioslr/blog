---
title: TS 中常用的类型
categories:
 - TypeScript
tags:
 - TypeScript
---

# TS 中常用的类型

## 常用的关键字

在梳理常用类型之前，线说说常用的两个关键字，**keyof**， **in**

### keyof
keyof 的作用是 获取对象类型接口的key, 产出key的**联合类型**

``` ts
interface Foo {
    a: string;
    b: string;
}

Type T = keyof Foo; // T: "a" | "b"
```

### in
in 的作用是 **遍历枚举类型** 


``` ts
type K = "a" | "b"

Type T = {[key in K]: string} // T: {a: string, b: sting}
```

keyof 与 in 经常联合使用产生复杂的类型。



