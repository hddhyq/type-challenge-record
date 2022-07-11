import type { Equal, Expect } from '@type-challenges/utils'

/** 3 - Omit */
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
type MyExclude<T, K> = T extends K ? never : T
type MyOmit1<T, K extends keyof T> = MyPick<T, MyExclude<keyof T, K>>
type MyOmit2<T, K extends keyof T> = {
  [key in MyExclude<keyof T, K>]: T[key]
}

type cases = [
  Expect<Equal<Expected1, MyOmit1<Todo, 'description'>>>,
  Expect<Equal<Expected2, MyOmit1<Todo, 'description' | 'completed'>>>,
]

type test = keyof Expected1

// @ts-expect-error
type error = MyOmit<Todo, 'description' | 'invalid'>

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
  completed: boolean
}

interface Expected2 {
  title: string
}
