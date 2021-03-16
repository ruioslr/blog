const promise = Promise.resolve('1');

promise.then(() => {
    return new Promise(res => {
        throw 111
        res(11);
    })
}).then((arg) => {
    console.log('then');
    console.log(arg)
}).catch(arg => {console.log('rej'); console.log(arg)})