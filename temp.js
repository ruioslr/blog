const dispatchEnhancer = [
    next => () => {console.log('func1 start'); console.log(next.toString()); next(); console.log('func1 end')},
    next => () => {console.log('func2 start'); console.log(next.toString()); next(); console.log('func2 end')},
    next => () => {console.log('func3 start'); console.log(next.toString()); next(); console.log('func3 end')}
].reduce((pre, item) => (...args) => pre(item(...args)))

const dispatchAfterEnhancer = dispatchEnhancer(dispatch);

function dispatch () {
    console.log('dispatch')
}

dispatchAfterEnhancer();

// 输出

// func1 start
// func2 start
// func3 start
// dispatch
// func3 end
// func2 end
// func1 end