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

**子类型的可选要比父类少，父类型约束性更弱**

**在对象中，属性更多的是子类型，表示需要更多的字段，即约束性更强**

**子类型可以赋值给父类型，反之不可以**

**对象和联合类型是反着的，联合类型或的越多，则越是父类，这和对象里是反着的，对象里字段越多代表约束性越强，越是子类型**

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

**extends 关键字前面是泛型，且泛型是联合类型，则也会遍历**

**T['a' | 'b'] 这样是 T['a'] | T['b'] 即： 索引访问也会遍历分发，得到联和类型**

```ts
type K = "a" | "b"

Type T = {[key in K]: string} // T: {a: string, b: sting}
```

keyof 与 in 经常联合使用产生复杂的类型。

### 逆变、协变

- 具有父子关系的多个类型，在通过`某种构造关系`构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的
- 逆变一版出现在函数形参上，ts 默认是双向协变（即，不管是协变还是逆变，类型检查都通过），开启 strictFunctionType 则开启逆变

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

**总结，就是 extends 前面的参数为`联合类型`时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。**

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

- infer 推导的名称相同并且都处于`逆变`的位置，则推导的结果将会是`交叉类型`

```ts
type Bar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : never;

// type T1 = string
type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;

// type T2 = never
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
```

- infer 推导的名称相同并且都处于`协变`的位置，则推导的结果将会是`联合类型`

## 内置类型工具实现

### Partial

```ts
type Partial<T> = {
  [key in keyof T]?: T[key];
};
```

### ReadOnly

```ts
type ReadOnly<T> = {
  readonly [key in keyof T]: T[key];
};
```

### Pick

```ts
type Pick<T, K extends keyof T> = {
  [key in K]: T[key];
};
```

### Record

```ts
type Record<T extends keyof any, K> = {
  [key in T]: K;
};
```

### Exclude

Exclude<T, K>提取联合类型 T 中 没有 K 的 类型

```ts
type Exclude<T, K> = T extends K ? never : T;

/**
 * @example
 * type Eg = 'key1'
 */
type Eg = Exclude<"key1" | "key2", "key2">;


原理： 1, extends 前面是联合类型， 则会分解（遍历每一个子类型），返回一个联合类型；2 never 与其他类型联和，则还是其它类型

/**
 * @example
 * type Eg2 = string | number
 */
type Eg2 = string | number | never
```

### Extract

Extract<T, K>提取联合类型 T 和联合类型 K 的所有交集。

```ts
type Extract<T, K> = T extends K ? T : never;
```

### Omit

Omit<T, K>从类型 T 中剔除 K 中的所有属性。

```ts
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
```

### Parameters

Parameters 获取函数的参数类型，将每个参数类型放在一个元组中。

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args： infer P) ? P : never;


/**
 * @example
 * type Eg = [arg1: string, arg2: number];
 */
type Eg = Parameters<(arg1: string, arg2: number) => void>;
```

### ReturnType

ReturnType 获取函数的返回值类型

```ts
Type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never
```
