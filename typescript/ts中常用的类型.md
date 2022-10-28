---
title: TS 中常用的类型
categories:
  - TypeScript
tags:
  - TypeScript
---

# TS 中常用的类型

## ts 判断父子类型

- 联合类型是父类型，交叉类型是子类型

**子类型比父类型更加具体,父类型比子类型更宽泛**

## 常用的关键字

在梳理常用类型之前，线说说常用的两个关键字，**keyof**， **in**

### keyof

keyof 的作用是 获取对象类型接口的 key, 产出 key 的**联合类型**

```ts
interface Foo {
    a: string;
    b: string;
}

Type T = keyof Foo; // T: "a" | "b"
```

### in

in 的作用是 **遍历枚举类型**

```ts
type K = "a" | "b"

Type T = {[key in K]: string} // T: {a: string, b: sting}
```

keyof 与 in 经常联合使用产生复杂的类型。

### 逆变、协变

- 具有父子关系的多个类型，在通过`某种构造关系`构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的
- 逆变一版出现在函数形参上，ts 默认是双向协变，开启 strictFunctionType 则开启逆变

### extends

```ts
// 表示条件类型，可用于条件判断

/**
 * @example
 * type A1 = 1
 */
type A1 = "x" extends "x" ? 1 : 2;

/**
 * @example
 * type A2 = 2
 */
type A2 = "x" | "y" extends "x" ? 1 : 2;

/**
 * @example
 * type A3 = 1 | 2
 */
type P<T> = T extends "x" ? 1 : 2;
type A3 = P<"x" | "y">;
```

**提问：为什么 A2 和 A3 的值不一样？**

- 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型
- 若 extends 前面的类型是`泛型`，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给 extends 后面的类型（是一个`分发`的过程）。

**总结，就是 extends 前面的参数为联合类型时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。**

eg:

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;

// StrArrOrNumArr = string[] | number[]
```

- 如果不想被分解（分发），做法也很简单，可以通过简单的元组类型包裹以下：

```ts
type P<T> = [T] extends ["x"] ? 1 : 2;
/**
 * type A4 = 2;
 */
type A4 = P<"x" | "y">;

type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

type StrArrOrNumArr = ToArrayNonDist<string | number>;

// StrArrOrNumArr = (string | number)[]
```

### infer

- 主要是用于 extends 的条件类型中让 Ts 自己推到类型

**特性：**
