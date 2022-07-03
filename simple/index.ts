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
type TupleToObject<T extends readonly any[]> = {
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
type First<T extends any[]> = T extends [infer F, ...any] ? F : never

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
type Length<T extends readonly any[]> = T['length']

// 要点：元组 ['length'] 返回长度，数组 ['length'] 返回 number

// const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
// const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

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
