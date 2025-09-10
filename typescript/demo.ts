namespace demo {
    type Partical<T> = {
        [key in keyof T]?: T[key];
    }

    type ReadOnly<T> = {
        readonly [key in keyof T]: T[key];
    }

    type Pick<T,K extends keyof T> = {
        [key in K]: T[key];
    }

    // Exclude和Extract主要就是处理联合类型
    // extends前面的泛型是联合类型，则会分发
    type Exclude<T, U> = T extends U ? never : T;
    type Extract<T, U> = T extends U ? T : never;

    type Omit<T, K extends keyof any> = {
        [key in Exclude<keyof T, K>]: T[key];
    }

    type Params<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;
}


// 注意，ts遍历有两个情况： 1， in 关键字在对象类型里面，会遍历后面的联合类型，这个叫做映射类型；2，extends 关键字在条件类型（三目运算）时，如果前面是一个泛型，而且，泛型是一个联合类型，则会对这个联合类型进行分发
