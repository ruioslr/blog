const promise = new Promise(() => {
    throw new Error('错了')
})

const log = a => console.log(a.toString())

const logRes = () => console.log('res')
const logRej = () => console.log('rej')


// 把这个写入笔记： promise 的reject被处理后，会继续走下去，如果处理程序没有抛异常则走then，否则走catch
// promise.then(() => {
//     log(1)
// }, () => log('2')).then(() => {
//     log('then')
// }, () => {
//     log('catch')
// })

// promise 的catch 捕获到的是第几个异常？
promise.then(() => {
    // throw new Error('错误2');
}).then(() => log(2)).catch((err) => {
    console.log(err.toString());
    return 111
}).catch(() => console.log(222)).catch(() => console.log(333)).then(() => Promise.reject(11)).catch(log)
