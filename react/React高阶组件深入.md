# React高阶组件深入

高阶组件是React封装公共逻辑的常用方式, [react-component](https://react-component.github.io/badgeboard), [React-Redux](https://https://github.com/reduxjs/react-redux), 等都大量使用了高阶组件。

## 高阶组件的常见功能

* 代码复用，抽象公共代码
* 渲染劫持
* State 抽象和更改
* Props更改

在探讨高阶组件的功能之前，先讨论如何实现一个高阶组件

## 高阶组件的常见模式

常见的高阶组件实现方式有：

* 属性代理 (Props Proxy）
* 反向继承 (Inheritance Inversion)

### 属性代理

属性代理的方式实现高阶组件代码通常如下：

``` js
function ppHOC(WrapperCom){
    return class PP extends React.Component {

        doSomethingWithRef = ref => {}

        addProps = {
            // some new props
        }

        render() {
            return <WrapperCom ref={this.doSomethingWithRef} {...this.addProps}/>
        }
    }
}
```

属性代理的好处是：

* 获取组件的实例ref
* 更改组件的Props
* 抽象State
* 将组件与其他组件组合

获取组件ref一节更改Props在上述代码中已经有所体现，接下来看看其它两个体现。

#### 抽象State

下面是一个简单的使用高阶组件实现表单组件双向绑定的例子

``` js
function WrapperInput(inputCom) {
    return class PP extend React.Component{

        state = {
            value: '',
        };

        onChange = e => this.setState({value: e.target.value});

        render() {
            const {value} = this.state;
            return <inputCom {...this.props} value={value} onChange={this.onChange}/>
        }
    }
}
```

将input的状态向上抽离。

#### 将组件与其他组件组合

与其他组件的组合很好理解，如下代码：

``` js
function Hoc(WrappedComponent){
    return class PP extend React.Component{
        render() {
            return <div className='classname'>
                <WrappedComponent/>
                <div></div>
            </div>
        }
    }
}
```
### 反向继承

反向继承的方式实现高阶组件代码通常如下：

``` js
function iiHoc (WrappedComponent) {
    return class II extends WrappedComponent {

    }
}
```

返回的包装组件 `II` 继承自 `WrappedComponent` 使得 `II` 可以 获取到 `WrappedComponent` 的 *state*, *prop*, 以及 *生命周期*。 

一个常见的使用场景是 验证登录
``` js
function validateLogin (WrappedComponent) {
    return class II extends WrappedComponent{
        render () {
            if(loggined){
                return super.render();
            }else{ 
                return null;
            }
        }
    }
}
```

当然，实现同一个逻辑并不限定于使用哪一种特定的模式，如上述验证登录的例子，使用 **属性代理** 的方式也可以实现：

``` js
function ppValidateLogin (WrappedComponent) {
    return class PP extends React.Component {
        render() {
            if(loggined) {
                // 注意： 这里需要将原本传给 WrappedComponent 的prop传递下去
                return <WrappedComponent {...this.props}/>;
            }else {
                return null;
            }
        }
    }
}
```

**通常，高阶组件在使用时可以使用装饰器的形式** 类似：

``` js
@ppValidateLogin
class XX extends React.Component{
    /// do something
}
```









