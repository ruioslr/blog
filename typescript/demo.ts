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
    type Exclude<T, U> = T extends U ? never : T;
    type Extract<T, U> = T extends U ? T : never;

    type Omit<T, K extends keyof any> = {
        [key in Exclude<keyof T, K>]: T[key];
    }

    type Params<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;
}