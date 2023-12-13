---
title: monad 粗浅介绍 
date: 2023-12-12 21:20:47 
updated: 2023-12-13 22:01:40
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

1. 类型构造器 `M` ，在 go 中可以理解为一种名为 `M` 包裹着 `T` 的泛型结构体 `M<T>{ val: T }`
2. 类型转换器 ` unit :: T -> M T `，在 go 中可以理解为由值 `T` 构造 `M` 的函数 `func FromVal[T any](val T) -> M<T>`
3. 组合器 `flatmap :: M T -> ( T -> M U) -> M U` ，在 go 中可以理解为 `M<T>{ val: T }` 这个结构体具有一个成员方法 `func[T,U any]( func(T) -> M<U> ) -> M<U>` ，能够接受一个函数实现从 `M<T>` 到 `M<U>` 的变换。

更严格(或者说更加符合数学上的定义)，一个 monad 还必须有以下三个定律(约束):

1. 转换子是 [left-identity](https://en.wikipedia.org/wiki/Identity_element) 的: `func FromVal[T any](val T) -> M<T>` 等价于
2. 23
3. 123

## monad 有什么用?

### 另一个宇宙的 go option

### monad 如何解决回调地狱

### monad 在流式处理中的应用

## 总结
