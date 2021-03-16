---
title: Axios 请求取消
categories:
 - axios
tags:
 - Axios 源码
 - 源码
---

# Axios 请求取消


在原生xhr中，请求取消的途径是调用xhr.abort()。
## Axios如何取消请求

```js
var CancelToken = axios.CancelToken;
var source = CancelToken.source();
axios.get('/get?name=xmz', {
    cancelToken : source.token
}).then((response)=>{
    console.log('response', response)
}).catch((error)=>{
    // 请求取消后会走catch
    if(axios.isCancel(error)){
        console.log('取消请求传递的消息', error.message)
    }else{
        console.log('error', error)
    }
})
// 取消请求
source.cancel('取消请求传递这条消息');

```

可以看到axios取消请求的方式是先获取**CancelToken**，

```js
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  // cancel 即为source.cancel函数本体
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```

**CancelToken.source**执行后返回，一个有token和cancel属性的对象，而调用**cancel**之后，请求就被取消了。

## 源码角度看如何取消请求

可以看到，当执行**cancel**后，请求就被取消，cancel方法是创建CancelToken实例时传入的函数的第一个参数，即CancelToken构造函数中的：

```js
function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  }
```

它的作用是让**cancelToken.reason** 为一个**Cancel**实例，并resolve掉**cancelToken.promise**。

在源码的xhr.js中，请求时：

```js
    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

```

会判断是否有cancelToken,有则在**cancelToken.promise**的then上**注册**一个回调，这个回调会调用**xhr.abort()**取消请求。

所以，当调用cancel方法时，会触发**cancelToken.promise**的then回调从而取消请求。





