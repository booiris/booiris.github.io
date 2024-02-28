---
title: 一个关于 go 泛型的 issue 翻译和分析
date: 2024-02-20 22:10:20
updated: 2024-02-28 12:46:37
tags: 
top: false
mathjax: true
categories:
  - blog
author: booiris
---

## 引言

众所周知， go 的泛型并不完善，由于其不支持 `parameterized methods` (泛型方法)，导致其无法实现 monad、流式调用等等操作。在这个 issue 中 [proposal: spec: allow parameterized methods in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085) 有着充分的讨论，本文旨在对其中的讨论进行翻译与分析，找出 go 是 xx 的原因，如有错误恳请斧正。

## 前置知识

在看 issue 之前，首先介绍一下泛型的通常实现方式，一般有如下几种方式

1. **类型擦除**: 这是 Java 泛型的实现方式。在编译时，泛型类型信息会被擦除，所有的泛型被转换为基类 Object (在 go 中相当于将所有的类型变成 interface{} )，编译器同时会在必要时插入类型转换代码来确保类型安全。
2. **模板实例化**： C++ 使用模板来实现泛型。在编译时，模板会生成对应于每种具体类型的实例化代码。如 `T add(T a, T b) ` 的泛型方法，对于 `add(1,2)` 和 `add(1.0,2.0)` 会生成两个函数 `int add(int a, int b)` 和 `double add( double a, double b)` 。
3. **即时编译**: [How Generics Differ in Java and C# | HackerNoon](https://hackernoon.com/how-generics-differ-in-java-and-c), [C#泛型详解 - 知乎](https://zhuanlan.zhihu.com/p/348761322), [c# - What is reification? - Stack Overflow](https://stackoverflow.com/questions/31876372/what-is-reification)，从这些链接可以大致看出，c# 的泛型实现是编译时使用占位符表示泛型类型，然后在运行时动态实例化各种类型。

回到 go 的泛型，实际上 go 的泛型实现方式有三种提案，下面分别介绍这三种提案，有助于后续对 issue 中的讨论进行分析:

### Stenciling

[Generics implementation - Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-stenciling.md)

首先是被称为蜡印(Stenciling) 的实现，实际上这个 c++、rust 的泛型实现方法很相似，都是在编译实例化所有的类型，生成多个对应类型的函数。

对于如下泛型函数:

```go
func f[T1, T2 any](x int, y T1) T2 {
    ...
}
```

存在如下两个调用:

```go
var a float64 = f[int, float64](7, 8.0)
var b struct{f int} = f[complex128, struct{f int}](3, 1+1i)
```

使用 Stenciling 方法会实例化两个类型函数用于调用:

```go
func f1(x int, y int) float64 {
    ... identical bodies ...
}
func f2(x int, y complex128) struct{f int} {
    ... identical bodies ...
}
```

由于不是 go 泛型的实际实现，所以其中所提到的命名实现、实例化方法、类型约束和重复实例化代码处理就不细说了。具体提一下其中的 risks 部分。

对于 Stenciling 方法，提案提出两个问题:

1. 编译期实例化泛型导致编译时间变长
2. 编译期实例化泛型导致生成的代码变多，生成的二进制文件变大，有可能导致 instruction cache miss 和 分支预测失效(为啥?)等问题。

提案末尾中大致提出了使用增量编译减少编译时间、多次调用编译器来去除重复的实例化代码(因为 go 是以包维度进行编译的)等方案。不过这些都不重要，重要的是提案中的一段话:

> I suspect there will be lots of cases where sharing is possible, if the underlying types are indistinguishable w.r.t. the garbage collector (same size and ptr/nonptr layout)

作者认为尽管类型可以有很多个(如 `int` 、`type myInt int` )，但实际上内存布局都是相同的，相同内存布局的值类型可以共享代码，这就减少了生成的代码大小同时也加快了编译时间。事实上这就是 go 实际的泛型实现(GC Shape Stenciling) 。

### Dictionaries

[Generics implementation - Dictionaries](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-dictionaries.md)

字典(Dictionaries)方式的实现方式正如其名，对于如下泛型函数:

```go
func f[T1, T2 any](x int, y T1) T2 {
    ...
}
```

存在如下两个调用:

```go
var a float64 = f[int, float64](7, 8.0)
var b struct{f int} = f[complex128, struct{f int}](3, 1+1i)
```

那么编译其会实例化**一个**函数和**多个**字典:

```go
type pos1CallSiteDictionary struct {
}

type pos2CallSiteDictionary struct {
}

func f (type_info dictionary, x int, y T1) T2 {
    ...
}
```

#### dictionary 包含的信息

### GC Shape Stenciling

[Generics implementation - GC Shape Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-gcshape.md)

## 正文

下面终于来到 [issue](https://github.com/golang/go/issues/49085) 分析环节。

首先是问题提出人 **[mariomac](https://github.com/mariomac)** 提出由于 go 的泛型不支持 `parameterized methods`，所以如下代码无法编译:

```go
func (si *stream[IN]) Map[OUT any](f func(IN) OUT) stream[OUT]
```

这就导致了在 go 中无法实现常规的流式处理方法。同时 **[mariomac](https://github.com/mariomac)** 也提出如果 go 能支持 `parameterized methods`，那么某些领域在构造代码的时候会更加简便，例如(举的例子奇奇怪怪的，看着也没用到 `parameterized methods`):

1. testing (?): `Assert(actual).ToBe(expected)`
2. mocking (?): `On(obj.Sum).WithArgs(7, 8).ThenReturn(15)`

### 原因

之后有人贴出 go 不支持 `parameterized methods` 的原因: [parameterized methods Proposal](https://go.googlesource.com/proposal/+/refs/heads/master/design/43651-type-parameters.md#No-parameterized-methods)。考虑如下代码:

```go
package p1
type S struct{}
func (S) Identity[T any] (v T) T { return v }

package p2
type HasIdentity interface {
	Identity[T any] (T) T
}

package p3
import "p2"
func CheckIdentity(v interface{}) {
	if vi, ok := v.(p2.HasIdentity); ok {
		if got := vi.Identity[int] (0); got != 0 {
			panic(got)
		}
	}
}

package p4
import (
	"p1"
	"p3"
)
func CheckSIdentity() {
	p3.CheckIdentity(p1.S{})
}
```

在上面的代码中，p1 中的 S 实现了 p2 中的 `HasIdentity` 接口，在 p3 中有一个函数实现了将入参断言为 `HasIdentity` 并调用其中的函数的功能。在 p4 中调用了 p3 中的函数并传入了 p1 中定义的 S。

看着还挺合理，但是问题来了，在 p3 中的 `CheckIdentity` 在断言完入参后，调用了一个类型为 `int` 的 `Identity` 函数。根据上面函数的调用链我们可以知道，它其实是在调用 `p1.S.Identity[int]`，只需要实例化一个 `p1.S.Identity[int]` 代码块即可。然而，由于 go 的**大道至简**，类型只有通过 import 才可见，也就是说 p3 是无法感知到 p1.S 这个类型的，所以实例化 `p1.S.Identity[int]` 也就无从说起了。

之后提案中给出了三个方案:

1. 编译器努努力，根据函数的调用链实例化对应的函数。然而由于 go 中的**反射**的存在，在编译期实际上无法确定所有的函数调用链 。(**这个也是我感觉 go 支持 `parameterized methods` 里最难受的地方**)
2. 学习 java or C#，运行时实例化，这就导致了 go 需要支持某种 JIT，或者使用基于反射的方法，这些实现起来都十分复杂，而且会导致运行时速度变慢。
3. 约束 interface 中禁用 `parameterized methods` ，因为无法感知类型的原因就是 interface 将实际类型信息隐藏了，不过还是存在反射的问题(给 reflect 加个 hook 记录调用?或者直接禁止反射调用泛型函数)：

```go
type S struct{}
func (S) Identity[T any] (v T) T { return v }

func main() {
	f, _ := reflect.TypeOf(S{}).MethodByName("Identity")
	f.Func.Call([]reflect.Value{reflect.ValueOf(S{}), reflect.ValueOf(0)})
}
```

在这里我想讲一讲第三点，提案给出的原文是:

> Or, we could decide that parameterized methods do not, in fact, implement interfaces, _but then it's much less clear why we need methods at all. If we disregard interfaces, any parameterized method can be implemented as a parameterized function._

后面这一段真的是迷惑发言(issue 里有些人也对这段提出疑问)，提案作者认为如果 interface 中禁用 `parameterized methods`, 那为啥还需要 `parameterized method`，因为所有的 `parameterized method` 都可以用 `parameterized function` 实现？？？？

难不成作者认为 `func (S[T]) F[U] () U` 可以简单等效为 `func F[T, U] (T) U` ，然后调用方式 `x.f(y).g(z)` 和 `g(f(x, y), z)` 没区别 🤔？那 go 语言写起来那么啰嗦的原因找到了(。 具体来说请看这个[评论](https://github.com/golang/go/issues/49085#issuecomment-995993517) 。

后面作者的补充也很迷惑: [proposal: spec: allow parameterized methods in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-1291237249)，不予置评了。

### 翻译

由于之后的讨论太长，所以接下来省略部分评论(有些不是关于泛型的讨论)并且根据 issue 里提出的不同解决方案进行分类。

#### 妥协派

**[deanveloper](https://github.com/deanveloper)**:

> I think this solution makes the most sense. They could then (under the hood) be treated a regular function. The reason why this would be useful is that methods do not only serve the purpose of implementing interfaces; methods also serve as a means of organization for functions that operate on particular structures.
> It may be a bit of a challenge about how type-parameterized methods would appear in `"reflect"`, though. ---- [link](https://github.com/golang/go/issues/49085#issuecomment-948108705)

[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-952701440)

和我的想法一样，认为给 interface 加入不能有 `parameterized methods` 的约束，剩下就只用处理反射的问题就行了。虽然没了泛型 interface 就不能实现通用迭代器，但是残缺的 `parameterized methods` 也能实现 monad 、简单的流式调用等操作。

#### 实战派 **[jpap](https://github.com/jpap)**

#### gava派 **[mariomac](https://github.com/mariomac)**

链接：[proposal: spec: allow parameterized methods in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-986056824)

#### 语法糖派(投降派)

**[wxblue](https://github.com/wxblue)**:

> This works fine, but breaks the chained call.  
> Maybe add some syntactic sugar like extension methods in C#. ----[link](https://github.com/golang/go/issues/49085#issuecomment-1064889791)

这一派

## 总结
