---
title: monad 粗浅介绍 
date: 2023-12-12 21:20:47 
updated: 2023-12-13 22:56:24
tags: [] 
top: false
mathjax: true
categories: [ blog ]
author: booiris
---

## 什么是 monad?

monad(单子) 是函数式编程中的一种抽象，本文旨在对 monad 的粗浅介绍，所以跳过其数学上的定义(其实是目前笔者也不太懂🤫)，通过一些具体的例子说明它的概念和作用。

### 定义

尽管没有太复杂的数学概念，但还是需要一个定义说明什么样的东西才能称之为 monad。在 wiki 的定义中:

> [Monad (functional programming) - Wikipedia](https://en.wikipedia.org/wiki/Monad_(functional_programming)#Definition)

一个 monad 包含三个部分:

1. 类型构造子 `M` 。

> 在 go 中可以理解为一种名为 `M` 包裹着 `T` 的泛型结构体 `M<T>{ val: T }`

2. 类型转换子 ` Unit :: T -> M T `。

> 在 go 中可以理解为由值 `T` 构造 `M` 的函数 `func Unit[T any](val T) -> M<T>`

3. 组合子 `>>=(FlatMap) :: M T -> ( T -> M U) -> M U` 。

> 在 go 中可以理解为 `M<T>{ val: T }` 这个结构体具有一个成员方法 `func flatMap[T,U any](func(T) -> M<U>) -> M<U>` ，能够接受一个函数实现从 `M<T>` 到 `M<U>` 的变换。

更严格(或者说更加符合数学上的定义)，一个 monad 还必须有以下三个定律(约束):

1. 转换子 `Unit` 是组合子 `>>=` 的左[单位元](https://en.wikipedia.org/wiki/Identity_element): `Unit(x) >>= f ↔ f(x)` 。

> 在 go 中可以理解为 `Unit(x).FlatMap(f)` 的执行结果和执行 `f(x)` 结果相同

2. 转换子 `Unit` 是组合子 `>>=` 的右[单位元](https://en.wikipedia.org/wiki/Identity_element): `Mx >>= Unit ↔ Mx`

> 在 go 中可以理解为 `M{ val: x }.FlatMap(Unit)` 的执行结果等于 `M< val: x >`

3. 组合子 `>>=` 满足结合律: `ma >>= λx -> (f(x) >>= λy -> g(y)) ↔ (ma >>= λx -> f(x)) >>= λy -> g(y)`

> 在 go 中可以理解为以下两个过程执行结果相等

```go
F = func[T,U any](x T) M<U>  { f(x) } // f(x) 是对 x 的一些行为
G = func[T,U any](y T) M<U> { g(y) } // g(y) 是对 y 的一些行为

M{ val: x}.FlatMap(F).FlatMap(G)
```

## monad 有什么用?

### 另一个宇宙的 go option

### monad 如何解决回调地狱

### monad 在流式处理中的应用

## 总结
