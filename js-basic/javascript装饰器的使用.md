# Javascript 装饰器的使用
随着ES6的广泛使用，class 类的概念在javascript中出现，而在某些场景下，需要在不改变类或者类的属性的情况下扩展一些功能，于是装饰器出现了。

## 装饰器简介

在类或类属性之前加上@... 用于对类或累的属性进行一些功能注入，类似Java里的注解

## 作用于类的装饰器

当装饰器作用于类时

```javascript
@log
class MyClass { }

function log(target) { // 这个 target 在这里就是 MyClass 这个类
   target.prototype.logger = () => `${target.name} 被调用`
}

const test = new MyClass()
test.logger() // MyClass 被调用
```

可以看到：装饰器实质上是一个函数，此时函数参数target是**被装饰类本身**。log装饰器作用在MyClass上，在其原型在添加了一个logger方法，使得其所有实例都可以调用该方法。

在很多场景下，我们使用的装饰器可以传参，这是装饰器生成函数。

```javascript
@log('hi')
class MyClass { }
// 定义装饰器
function log(text) {
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name} 被调用`
  }
}
```

在react-redux中在使用connent时也是这样：

```javascript
@connect(mapStateToProps, mapDispatchToProps)
export default class MyComponent extends React.Component {}
```
## 作用于类属性的装饰器

与装饰类不同，装饰类属性时，实质上是对属性的描述符进行操作，类似于Object.defineProperty(obj, prop, descriptor),如下代码：

```javascript
class MyClass {
  @readonly(true) // 对属性方法装饰
  method() { console.log('cat') }
}

// 装饰器生成函数定义
function (value) {
    // 这里才是真正的装饰器
  return function (target, key, descriptor) { 
    descriptor.writable = !value
    return descriptor
  }
}

const instance = new MyClass()
instance.method = () => console.log('dog')
c.method() // cat
```
可以看到，readonly是一个装饰器生成器函数，返回一个修饰类方法的装饰器，该装饰器的三个参数分别是： **该属性的原型**，属性名，和属性描述对象。最后，属性装饰器必须有返回值，返回值是该属性的描述对象。


