---
title: Axios 请求过程
categories:
 - axios
tags:
 - Axios 源码
 - 源码
---

# Axios 请求原理

## Axios如何发起请求

axios一般用以下的方式发起请求：

```js
axios.get('/get?name=xmz')
    .then((response)=>{
        console.log('response', response)
    })
    .catch((error)=>{
        console.log('error', error)
    })
```

实际上，axios[get，post,....]都是调用**axios.request**方法。

## Axios 请求原理

```js
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API

  // axios.[get,post,put ....]转换成request(config)
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

    // 合成config
  config = mergeConfig(this.defaults, config);

  // 设置请求的方法
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

```

request会先**根据默认的config和请求配置的config**合成config对象然后处理请求method，接下来时请求和响应相关的拦截器操作，将promise串起来并返返回，接下来具体说说axios中的拦截器。


## axios中的拦截器

首先看如何注册拦截器：

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

拦截器的注册是在下面代码中实现。

```js
    // axios.request 方法片段

  var chain = [dispatchRequest, undefined];
  // promise链的第一个promise，它的状态是fufilled
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

```

请求拦截器会像前插入到chain数组中，响应拦截器会向后插入到chain数组中，并将promise串联起来，形成promise的**链式调用**。由于promise链的第一个promise是fufilled状态，当执行到上述中的**while**代码块时，**请求**拦截器已经串行执行完，直到**dispatchRequest**方法，而这个方法是真正发起请求的方法，所以当请求结束后，才会接着走promise链，即后面的**响应**拦截器。


## axios请求过程

axios的请求是调用**dispatchRequest**实现的。

::: details 点击查看dispatchRequest源码
```js
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  // 转换请求数据
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  //axios.get post... 等方法的快捷调用
  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

```
:::

这个方法会依次处理headers，转换请求参数，建立get，post等快捷调用，和找到当前平台对应的adapter（xhr，http）发起调用。





