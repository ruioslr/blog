---
title: javascript继承方式
categories:
 - Javascript
tags:
 - Javascript
---

# Javascript继承方式


## 原型链继承

即： 父类的实例作为子类的原型

```js
function People(name) {
    this.name = name;
}

function Man(){

}

Man.prototype = new People();
```

**优点**：父类新增的实例子类可以访问
**缺点**：
    - 无法实现多继承
    - 创建子类实例时，不能向父类构造函数传参


## 借用构造函数继承

即： 在子类中调用父类构造函数

```js
function People(name){
    this.name = name;
}

function Man(){
    People.call(this, 'ruios')
}

```

**优点**：
    - 子类可以像父类构造函数传参
    - 可以多继承(调用多个构造函数)
**缺点**：
    - 只能继承父类的实例属性和方法，无法继承父类的原型

## 组合继承

即： 同时使用**原型链继承**和**构造函数继承**

```js
function People(name){
    this.name = name;
}

function Man() {
    People.call(this, 'ruios');
}

Man.prototype = new People();
Man.prototype.constructor = Man;
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。
缺点：父类需要调用两次

## 原型式继承

即： Object.create的实现方式，返回一个以传入的对象为原型的对象

```js
function create(obj){
    function F() {};
    F.prototype = obj;
    return new F();
}
```

缺点： 传入的对象属性改变，所有以这个对象为原型的对象的属性都会改变


## 寄生组合式继承

即： 解决组合式继承需要调用两次父类的问题。使用一个中间函数的原型指向父类prototype

```js
function People(name){
    this.name = name;
}

function Man() {
    People.call(this, 'ruios');
}

Man.prototype = Object.create(People.prototype); //Object.create即为建一个中间函数，使其原型指向传入对象，返回这个函数的实例

```