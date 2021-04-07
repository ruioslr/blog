const promise = new Promise((res, rej) => {
    res(1);
})

const promise2 = promise.then((val) => {
    console.log(val);
    throw 3;
})


promise2.catch(val => console.log(val)).catch(val => console.log(val)).then(val => console.log(val))