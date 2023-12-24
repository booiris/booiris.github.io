---
title: monad 粗浅介绍
date: 2023-12-12 21:20:47
updated: 2023-12-24 21:07:56
tags: 
top: false
mathjax: true
categories:
  - blog
author: booiris
---

## 什么是 monad?

monad(单子) 是函数式编程中的一种抽象，本文旨在对 monad 的粗浅介绍，所以跳过其数学上的定义(其实是目前笔者也不太懂🤫)，通过一些具体的例子说明它的概念和作用。

### 定义

尽管没有太复杂的数学概念，但还是需要一个定义说明什么样的东西才能称之为 monad。在接下来的说明中，除了列举出数学定义以外，还有其在 go 语言中的具体表现形式。在 wiki 的定义中:

> [Monad (functional programming) - Wikipedia](https://en.wikipedia.org/wiki/Monad_(functional_programming)#Definition)

一个 monad 包含三个部分:

1. 类型构造子 `M` 。

	* 在 go 中可以理解为一种名为 `M` 包裹着 `T` 的泛型结构体 `M<T>{ val: T }`

3. 类型转换子 ` Unit :: T -> M T `。

	* 在 go 中可以理解为由值 `T` 构造 `M` 的函数 `func Unit[T any](val T) -> M<T>`

4. 组合子 `>>= or FlatMap :: M T -> ( T -> M U) -> M U` 。

	* 在 go 中可以理解为 `M<T>{ val: T }` 这个结构体具有一个成员方法 `func flatMap[T, U any] (func(T) -> M<U>) -> M<U>` ，能够接受一个函数参数实现从 `M<T>` 到 `M<U>` 的变换。

#### 更严格的定义

一个 monad 还必须含有以下三个约束:

1. 转换子 `Unit` 是组合子 `>>=` 的左[单位元](https://en.wikipedia.org/wiki/Identity_element): `Unit(x) >>= f <-> f(x)` 。

	* 在 go 中可以理解为 `Unit(x).FlatMap(f)` 的执行结果和执行 `f(x)` 结果相同

2. 转换子 `Unit` 是组合子 `>>=` 的右[单位元](https://en.wikipedia.org/wiki/Identity_element): `Mx >>= Unit <-> Mx`

	* 在 go 中可以理解为 `M{ val: x }.FlatMap(Unit)` 的执行结果等于 `M{ val: x }`

3. 组合子 `>>=` 满足结合律: `ma >>= λx -> (f(x) >>= λy -> g(y)) <-> (ma >>= λx -> f(x)) >>= λy -> g(y)`

	* 在 go 中可以理解为以下两个过程执行结果相等

```go
func F[T, U any](x T) M<U>  { f(x) } // f(x) 是对 x 的一些行为
func G[U, P any](y U) M<P> { g(y) } // g(y) 是对 y 的一些行为

func H[T, P any](x T) M<P> { F(x).FlatMap(G) } // g(f(x))

res1 := M{val: x}.FlatMap(H)
```

```go
func F[T, U any](x T) M<U>  { f(x) } // f(x) 是对 x 的一些行为
func G[U, P any](y U) M<P> { g(y) } // g(y) 是对 y 的一些行为

res2 := M{ val: x }.FlatMap(F).FlatMap(G)
```

## monad 有什么用?

在列举完 monad 的定义后，为了避免陷在抽象的世界里无法自拔，笔者在接下来会具体列举一些例子说明 monad 的作用，帮助更好地说明什么是 monad 。

### 另一个宇宙的 go error

在 go 编程中，可能常见如下代码:

```go
// 获取要查询的ID
func GetID () (int64,error) {}
// 获取 ID 对应的信息
func GetInfo (id int64) (Info,error) {}
// 获取上一个 Info 中 uid 对应的信息
func GetUserInfo (uid int64) (UserInfo,error) {}

func handle() error {
	id, err := GetID()
	if err != nil{
		return err
	}
	info, err := GetInfo(*id)
	if err != nil{
		return err
 	}
	userInfo, err := GetUserInfo(info.UID)
	if err != nil{
		return err
	}
	// use userInfo ...
}

```

可以看到 go 的灵魂出现了🤗

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/20231224210233.png)

当然笔者并不反对 go 这种严格处理返回

### monad 如何解决回调地狱

### monad 在流式处理中的应用

## 总结

## 相关阅读

* [Haskell Monad\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV17E411F7cH/)

* [Functors, Applicatives, And Monads In Pictures - adit.io](https://www.adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)

* [什么是 Monad (Functional Programming)？ - Belleve的回答 - 知乎 🤣](https://www.zhihu.com/question/19635359/answer/62415213)
