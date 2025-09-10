// bfs
function bfs(root) {
    const queue = [root];
    const result = [];
    while(queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        queue.push(...node.children);
    }
    return result;
}

// dfs
function dfs (root) {
    const result = [];
    const walk = node => {
        result.push(node);
        if(node.children.length){
            node.children.forEach(walk)
        }
    }

    walk(root);
    return result;
}

// curried
function curry(func){
    return function curried (...args) {
        if(args.length >= func.length){
            return func.apply(this, args)
        }else {
            return function (...args2) {
                // 注意，这里调用的是curried，这是一个递归调用！！！
                return curried.apply(this, [...args,...args2])
            }
        }
    }
}

// bind
// 注意一下是不是构造函数
Function.prototype.myBind = function (ctx, ...args) {
    const func = this;
    return function Fn (...args2) {
        return func.apply(this instanceof Fn ? this : ctx, [...args, ...args2])
    }
}

// call
Function.prototype.myCall = function (ctx, ...args){
    const fun = this;
    const symbol = Symbol('fun');
    ctx[symbol] = fun;
    const res = ctx[symbol](...args);
    delete ctx[symbol];
    return res;
}

// debounce
// 理解为回城，多次调用是重置定时器
function debounce(func, wait){
    let timer = null;
    return function(...args) {
        const ctx = this;
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
      timer  = setTimeout(() => {
          func.apply(ctx,args)
      }, wait)
    }
}

// throttle
// 理解为放技能，timer就是个节流阀
function throttle(func, wait) {
    let timer = null;
    return function(...args) {
        const ctx = this;
        if(!timer){
            timer = setTimeout(() => {
                func.apply(ctx,args);
                timer = null;
            },wait)
        }
    }
}

// debounce

// throttle
