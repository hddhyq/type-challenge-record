# type-challenge-record

[TS 学习笔记](https://www.processon.com/view/link/62c14da31e085372914ec515)
## 要点

类型物件，类型编程基础

### 泛型

工具类型的本质是构造复杂类型的泛型

```ts
type isSubTying<Child, Par> = Child extends Par ? true : false;
type isXX2 = isSubTyping<1, number>; // true
type isYY2 = isSubTyping<'string', string>; // true
type isZZ2 = isSubTyping<true, boolean>; // true
```

### 条件类型

搭配三元运算符和extends，判断两个类型的子类型关系

```ts
type isSubTyping<Child, Par> = Child extends Par ? true : false;

type isAssertable<T, S> = T extends S ? true :  S extends T ? true : false;

type isNumAssertable = isAssertable<1, number>; // true

type isStrAssertable = isAssertable<string, 'string'>; // true

type isNotAssertable = isAssertable<1, boolean>; // false
```

### 分配条件类型

入参是联合类型，则会被拆解为一个个独立的(原子)类型(成员)，然后进行类型运算。

```ts
type BooleanOrString = string | boolean;

type StringOrNumberArray<E> = E extends string | number ? E[] : E;

type WhatIsThis = StringOrNumberArray<BooleanOrString>; // boolean | string[]

type BooleanOrStringGot = BooleanOrString extends string | number ? BooleanOrString[] : BooleanOrString; //  string | boolean
```

可以使用一些特殊手段，让联合类型入参不被拆解。

```ts
type StringOrNumberArray<E> = [E] extends [string | number] ? E[] : E;

type WhatIsThis = StringOrNumberArray<string | boolean>; // string | boolean

// 如上，string | boolean 被当作一个整体对待
```

注意：`never` 是不能分配的底层类型，如果作为入参以原子形式出现在条件判断 `extends` 关键字左侧，
则实例化得到的类型也是 `never`

```ts
type GetSNums = never extends number ? number[] : never extends string ? string[] : never; // number[];

type GetNever = StringOrNumberArray<never>; // never
```

### 条件类型中的类型判断 `infer`

类型推断操作符 `infer` 来获取类型入参的组成部分。

```ts
type ElementTypeOfArray<T> = T extends (infer E)[] ? E : never;

type isNumber = ElementTypeOfArray<number[]>; // number

type isNever = ElementTypeOfArray<number>; // never
```

可以通过 `infer` 创建任意个类型推断参数，以此获取任意成员类型。

```ts
type ElementTypeOfObj<T> = T extends { name: infer E; id: infer I } ? [E, I] : never;

type isArray = ElementTypeOfObj<{ name: 'name'; id: 1; age: 30 }>; // ['name', 1]

type isNever = ElementTypeOfObj<number>; // never
```

### 索引访问类型

通过属性名、索引、索引签名按需提取对象（接口类型）任意成员的类型（注意：只能使用 [索引名] 的语法）

```ts
interface MixedObject {
  animal: {
    type: 'animal' | 'dog' | 'cat';
    age: number;
  };

  [name: number]: {
    type: string;
    age: number;
    nickname: string;
  };

  [name: string]: {
    type: string;
    age: number;
  };
}

type animal = MixedObject['animal'];
type animalType = MixedObject['animal']['type'];
type numberIndex = MixedObject[number];
type numberIndex0 = MixedObject[0];
type stringIndex = MixedObject[string];
type stringIndex0 = MixedObject['string'];
```

### `keyof`

使用 keyof 关键字提取对象属性名、索引名、索引签名的类型。

```ts
type MixedObjectKeys = keyof MixedObject; // string | number

type animalKeys = keyof animal; // 'type' | 'age'

type numberIndexKeys = keyof numberIndex; // "type" | "age" | "nickname"
```

### `typeof`

表达式上下文中使用 typeof，则是用来获取表达式值的类型,
如果在类型上下文中使用，则是用来获取变量或者属性的类型。

```ts
let StrA = 'a';

const unions = typeof StrA; // unions 类型是 "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

const str: typeof StrA = 'string'; // strs 类型是 string

type DerivedFromStrA = typeof StrA; // string
```

### 映射类型

可以使用索引签名语法和 in 关键字限定对象属性的范围。

```ts
type SpecifiedKeys = 'id' | 'name';

type TargetType = {
  [key in SpecifiedKeys]: any;
}; // { id: any; name: any; }

type TargetGeneric<O extends string | number | symbol> = {
  [key in O]: any;
}

type TargetInstance = TargetGeneric<SpecifiedKeys>; // { id: any; name: any; }
```

注意：我们只能在类型别名定义中使用 `in` ，如果在接口中使用则会提示 `ts(1169)` 的错误。

```ts
interface ITargetInterface {
  [key in SpecifiedKeys]: any; // ts(1169)
}
```

注意：`in` 和 `keyof` 也只能在类型别名定义中组合使用。

通过映射类型的工具类型，添加描述符：

```ts
type TargetGenericTypeReadonly<S> = {
  readonly [key in keyof S]: S[key];
}

type TargetGenericTypeReadonlyInstance = TargetGenericTypeReadonly<SourceInterface>; // { readonly id: number; readonly name?: string | undefined }

type TargetGenericTypeOptional<S> = {
  [key in keyof S]?: S[key];
}

type TargetGenericTypeOptionalInstance = TargetGenericTypeOptional<SourceInterface>; // { readonly id?: number; readonly name?: string | undefined }

type TargetGenericTypeRemoveReadonly<S> = {
  -readonly [key in keyof S]: S[key];
}

type TargetGenericTypeRemoveReadonlyInstance = TargetGenericTypeRemoveReadonly<SourceInterface>; // { id: number; name?: string | undefined }

type TargetGenericTypeRemoveOptional<S> = {
  [key in keyof S]-?: S[key];
}

type TargetGenericTypeRemoveOptionalInstance = TargetGenericTypeRemoveOptional<SourceInterface>; // { readonly id: number; name: string }
```

使用 as 重新映射 key (Typescript 4.1 起)

```ts
type TargetGenericTypeAssertiony<S> = {
  [key in keyof S as Exclude<key, 'id'>]: S[key];
}

type TargetGenericTypeAssertionyInstance = TargetGenericTypeAssertiony<SourceInterface>; // { name?: string | undefined; }
```
