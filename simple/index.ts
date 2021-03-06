import type { Equal, Expect } from '@type-challenges/utils'

/** 4. Pick */
type MyPick<T, K extends keyof T> = {
  [key in K]: T[K]
}

// interface Todo {
//   title: string
//   description: string
//   completed: boolean
// }

// type a = keyof Todo

// type TodoPreview = MyPick<Todo, 'title' | 'completed'>

// const todo: TodoPreview = {
//     title: 'Clean room',
//     completed: false,
// }

/** 7. 实现 Readonly */
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 要点：接口使用 keyof 遍历

// type cases = [
//   Expect<Equal<MyReadonly<Todo1>, Readonly<Todo1>>>,
// ]

// interface Todo1 {
//   title: string
//   description: string
//   completed: boolean
//   meta: {
//     author: string
//   }
// }

/** 11 - 元组转换为对象 */
type TupleToObject<T extends ReadonlyArray<PropertyKey>> = {
  [K in T[number]]: K
}

// 要点：元组 [number] 作为遍历手段

// const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
// const tupleNumber = [1, 2, 3, 4] as const
// const tupleMix = [1, '2', 3, '4'] as const

// type cases = [
//   Expect<Equal<TupleToObject<typeof tuple>, { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y' }>>,
//   Expect<Equal<TupleToObject<typeof tupleNumber>, { 1: 1; 2: 2; 3: 3; 4: 4 }>>,
//   Expect<Equal<TupleToObject<typeof tupleMix>, { 1: 1; '2': '2'; 3: 3; '4': '4' }>>,
// ]

// // @ts-expect-error
// type error = TupleToObject<[[1, 2], {}]>

/** 14 - 第一个元素 */
type First<T extends unknown[]> = T extends [infer F, ...any] ? F : never

// 要点：infer 推断类型

// type cases = [
//   Expect<Equal<First<[3, 2, 1]>, 3>>,
//   Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
//   Expect<Equal<First<[]>, never>>,
//   Expect<Equal<First<[undefined]>, undefined>>,
// ]

// type errors = [
//   // @ts-expect-error
//   First<'notArray'>,
//   // @ts-expect-error
//   First<{ 0: 'arrayLike' }>,
// ]

/** 18 - 获取元组长度 */
type Length<T extends readonly unknown[]> = T['length']

// 要点：元组 ['length'] 返回长度，数组 ['length'] 返回 number

const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

// type cases = [
//   Expect<Equal<Length<typeof tesla>, 4>>,
//   Expect<Equal<Length<typeof spaceX>, 5>>,
//   // @ts-expect-error
//   Length<5>,
//   // @ts-expect-error
//   Length<'hello world'>,
// ]

/** 43 - Exclude */
type MyExclude<T, U> = T extends U ? never : T

// type cases = [
//   Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, Exclude<'a' | 'b' | 'c', 'a'>>>,
//   Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, Exclude<'a' | 'b' | 'c', 'a' | 'b'>>>,
//   Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>,
// ]

/** 189 - Awaited */
// [original article](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4)
// my answer
// type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer E> ? MyAwaited<E> : T
type MyAwaited<T> = T extends Promise<infer P> ? (P extends Promise<unknown> ? MyAwaited<P> : P) : error;

// type X = Promise<string>
// type Y = Promise<{ field: number }>
// type Z = Promise<Promise<string | number>>
// type Z1 = Promise<Promise<Promise<string | boolean>>>

// type test = Awaited<number>

// type cases = [
//   Expect<Equal<MyAwaited<X>, string>>,
//   Expect<Equal<MyAwaited<Y>, { field: number }>>,
//   Expect<Equal<MyAwaited<Z>, string | number>>,
//   Expect<Equal<MyAwaited<Z1>, string | boolean>>,
// ]

// // @ts-expect-error
// type error = MyAwaited<number>

/** 268 IF */
type If<C extends boolean, T, F> = C extends true ? T : F

// type cases = [
//   Expect<Equal<If<true, 'a', 'b'>, 'a'>>,
//   Expect<Equal<If<false, 'a', 2>, 2>>,
// ]

// // @ts-expect-error
// type error = If<null, 'a', 'b'>

/** 533 - Concat */
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]

// type cases = [
//   Expect<Equal<Concat<[], []>, []>>,
//   Expect<Equal<Concat<[], [1]>, [1]>>,
//   Expect<Equal<Concat<[1, 2], [3, 4]>, [1, 2, 3, 4]>>,
//   Expect<Equal<Concat<['1', 2, '3'], [false, boolean, '4']>, ['1', 2, '3', false, boolean, '4']>>,
// ]

/** 898 - Includes */
// type Includes<T extends readonly any[], U> = {
//   [P in T[number]]: true
// }[U] extends true ? true : false;

// how to cycle campare it.
type Includes<T extends readonly unknown[], U> =
  T extends [infer First, ...infer Rest]
    ? Equal<First, U> extends true ? true : Includes<Rest, U>
    : false;

// type cases = [
//   Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
//   Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>, false>>,
//   Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
//   Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
//   Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
//   Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
//   Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
//   Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
//   Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
//   Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
//   Expect<Equal<Includes<[{ a: 'A' }], { readonly a: 'A' }>, false>>,
//   Expect<Equal<Includes<[{ readonly a: 'A' }], { a: 'A' }>, false>>,
//   Expect<Equal<Includes<[1], 1 | 2>, false>>,
//   Expect<Equal<Includes<[1 | 2], 1>, false>>,
//   Expect<Equal<Includes<[null], undefined>, false>>,
//   Expect<Equal<Includes<[undefined], null>, false>>,
// ]

/** 3057 - Push */
type Push<T extends unknown[], U> = [...T, U]

// type cases = [
//   Expect<Equal<Push<[], 1>, [1]>>,
//   Expect<Equal<Push<[1, 2], '3'>, [1, 2, '3']>>,
//   Expect<Equal<Push<['1', 2, '3'], boolean>, ['1', 2, '3', boolean]>>,
// ]

/** 3060 - Unshift */
type Unshift<T extends unknown[], U> = [U, ...T]

// type cases = [
//   Expect<Equal<Unshift<[], 1>, [1]>>,
//   Expect<Equal<Unshift<[1, 2], 0>, [0, 1, 2]>>,
//   Expect<Equal<Unshift<['1', 2, '3'], boolean>, [boolean, '1', 2, '3']>>,
// ]

/** 3312 - Parameters */
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never

// const foo = (arg1: string, arg2: number): void => {}
// const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
// const baz = (): void => {}

// type cases = [
//   Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
//   Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
//   Expect<Equal<MyParameters<typeof baz>, []>>,
// ]
