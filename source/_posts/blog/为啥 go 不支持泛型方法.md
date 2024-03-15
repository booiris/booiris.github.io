---
title: 为啥 go 不支持泛型方法
date: 2024-02-20 22:10:20
updated: 2024-03-15 22:21:50
tags: 
top: false
mathjax: true
categories:
  - blog
author: booiris
---

## 引言

众所周知， go 的泛型并不完善，由于其不支持 `parameterized methods` (泛型方法)，导致其无法实现 monad、流式调用等等操作。在这个 issue 中 [proposal: spec: allow parameterized methods in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085) 有着充分的讨论，本文旨在对其中的讨论进行总结(加一点~~指指点点~~)，找出 go 是 xx 的原因，如有错误恳请斧正。

## 有点长的前置知识…

在看 issue 之前，首先介绍一下泛型的通常实现方式，一般有如下几种方式

1. **类型擦除+虚函数表**: 这是 Java 泛型的实现方式。在编译时，泛型类型信息会被擦除，所有的泛型被转换为基类 Object (在 go 中相当于将所有的类型变成 interface{} )，编译器同时会在必要时插入类型转换代码来确保类型安全。
2. **模板实例化**: C++ 使用模板来实现泛型。在编译时，模板会生成对应于每种具体类型的实例化代码。如 `T add(T a, T b) ` 的泛型方法，对于 `add(1,2)` 和 `add(1.0,2.0)` 会生成两个函数 `int add(int a, int b)` 和 `double add( double a, double b)` 。
3. **即时编译**: [How Generics Differ in Java and C# | HackerNoon](https://hackernoon.com/how-generics-differ-in-java-and-c), [C#泛型详解 - 知乎](https://zhuanlan.zhihu.com/p/348761322), [c# - What is reification? - Stack Overflow](https://stackoverflow.com/questions/31876372/what-is-reification)，从这些链接可以大致看出，c# 的泛型实现是编译时使用占位符表示泛型类型，然后在运行时动态实例化各种类型。

回到 go 的泛型，实际上 go 的泛型实现方式有三种提案，下面分别介绍这三种提案，有助于后续对 issue 中的讨论进行分析。

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

#### 问题

对于 Stenciling 方法，提案提出两个问题:

1. 编译期实例化泛型导致编译时间变长
2. 编译期实例化泛型导致生成的代码变多，生成的二进制文件变大，有可能导致 instruction cache miss 和 分支预测失效(为啥?)等问题。

提案末尾中大致提出了使用增量编译减少编译时间、多次调用编译器来去除重复的实例化代码(因为 go 是以包维度进行编译的)等方案。不过这些都不重要，重要的是提案中的一段话:

> I suspect there will be lots of cases where sharing is possible, if the underlying types are indistinguishable w.r.t. the garbage collector (same size and ptr/nonptr layout)

提案认为尽管类型可以有很多个(如 `int` 、`type IntAlias = int` )，但实际上内存布局都是相同的，相同内存布局的值类型可以共享代码，这就减少了生成的代码大小同时也加快了编译时间。事实上这就是 go 实际的泛型实现(GC Shape Stenciling) 。

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

那么编译其会实例化**一个**函数，同时会有多个字典，每个字典包含一些运行时需要的信息:

```go
type pos1CallSiteDictionary struct {
	... runtime._type
}

type pos2CallSiteDictionary struct {
	... runtime._type
}

func f (type_info dictionary, x int, y T1) T2 {
    ...
}
```

对于泛型函数，会添加一个额外的 dictionary 参数，用于实例化泛型函数中的类型，传入的 dictionary 内容由**调用点生成和传入**。

#### dictionary 包含的信息

整个字典需要保存整个函数执行的环境，其中包含的信息是十分多的。在提案中列举了需要的信息:

##### Instantiated types

首先需要包含函数签名上的类型，可能以如下形式进行存储

```go
type dictionary struct {
    T1 *runtime._type
    T2 *runtime._type
    ...
}
```

出于打印栈的目的，字典中需要包含未被使用的类型。

##### Derived types

除了函数签名上的类型，字典中还需要保存函数中派生出的类型，比如泛型函数中如果定义了如下类型:

```go
type X struct { x int; y T1 }
m := map[string] T1{}
```

那么需要保存派生出来的类型:

```go
type dictionary struct {
    ...
    D1 *runtime._type // struct { x int; y T1 }
    D2 *runtime._type // map[string] T1
    ...
}
```

##### Subdictionaries

如果泛型中函数调用了其他的泛型函数，还需要保存对应泛型函数的字典。这样才能接着传递 dictionary 参数，调用对应的泛型函数，提案中称之为子字典:

```go
//  func g[T](g T) { ... }
//  in f[T1]: g[T1] (y)
type dictionary struct {
    ...
    S1 *dictionary // SubDictionary for call to g
    ...
}
```

##### Helper methods

字典中还需要保存泛型类型的操作符，比如对于如下运算:

```go
y2 := y + 1
if y2 > y { … }
```

为了表达泛型操作，需要将其中的 `+` 和 `>` 抽象出来变成一种方法保存到字典中:

```go
type dictionary struct {
    ...
    plus func(z, x, y *T1)      // does *z = *x+*y
    greater func(x, y *T1) bool // computes *x>*y
    ...
}
```

##### Stack layout

因为类型不确定，字典中还需要保存函数中所有非指针类型临时变量 ([4]T 是栈变量，[]T 不是栈变量) 的占用空间，用于分配栈空间。而之前提到过，字典是由调用点传入的，因为只有调用点才知道所有的类型，所以在调用点需要计算所需要的栈空间。然后字典中还需要保存每个临时对象在栈内的地址。

```go
type dictionary struct {
    ...
    frameSize uintptr
    stackObjects []stackObject
    ...
}
type stackObject struct {
    offset uintptr
    typ *runtime._type
}
```

对于泛型函数的嵌套调用也需要特殊处理。对于如下函数调用:

```go
func f[T1, T2 any](x int, y T1, h func(x T1, y int, z T2) int) T2 {
    var z T2
    ....
    r := h(y, x, z)
}
```

提案中提出了两种方法:

1. 逐个参数处理

逐个处理参数，将参数复制到栈上正确的位置:

```go
argPtr = SP
memmove(argPtr, &y, dictionary.T1.size)
argPtr += T1.size
argPtr = roundUp(argPtr, alignof(int))
*(*int)argPtr = x
argPtr += sizeof(int)
memmove(argPtr, &z, dictionary.T2.size)
argPtr += T2.size
call h
argPtr = roundUp(argPtr, 8) // alignment of return value start
r = *(*int)argPtr
```

2. 使用字典存储偏移量

或者提前计算出调用函数的入参出参在栈上的偏移量，然后保存到字典中，使用的时候根据偏移量复制参数:

```go
memmove(SP + dictionary.callsite1.arg1offset, &y, dictionary.T1.size)
*(*int)(SP + dictionary.callsite1.arg2offset) = x
memmove(SP + dictionary.callsite1.arg3offset, &z, dictionary.T2.size)
call h
r = *(*int)(SP + dictionary.callsite1.ret1offset)
```

##### Pointer maps

需要一个 bitMap 存储入参出参的空间大小和是否是指针类型。用于调用者分配空间入参和出参空间。

```go
type dictionary struct {
    ...
    argPointerMap bitMap // arg size and ptr/nonptr bitmap
    ...
}
```

#### 问题

提案中提到了虽然采用字典方法减少了代码的生成，但是占用的内存变多了。这就出现了 data cache misses 和 instruction cache misses 的替换。需要找一种折中的方法。

还有提案中提到使用字典方法也有可能导致性能的下降，比如当泛型方法中具体类型为 int 的情况，`x=y` 的操作在使用蜡印方法可以优化成一次寄存器复制的操作，而使用字典的方法，由于需要处理不同类型的数据，只能使用 `memmove` 操作复制数据，这无疑是一种额外的开销。

### GC Shape Stenciling

**！本节的分析基于提案和 go 1.18，部分信息可能和高版本的 go 有所不同，请注意区分。**

[Generics implementation - GC Shape Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-gcshape.md)

[proposal/design/generics-implementation-dictionaries-go1.18.md at master · golang/proposal · GitHub](https://github.com/golang/proposal/blob/master/design/generics-implementation-dictionaries-go1.18.md)

GC Shape Stenciling 是 go 的真正泛型实现。它是 Stenciling 和 Dictionaries 的折中实现。GC Shape 在提案中的解释是:

> The _GC shape_ of a type means how that type appears to the allocator / garbage collector.

举例来说 `int` 和 `type IntAlias = int` 是属于一个 GC Shape，比较特别的是对于所有的指针类型属于一个 GC Shape，使用虚表进行方法的调用。

对于每一个 GC Shape，go 会实例化一个具体的代码，具体来说，对于如下

```go
package main

func f[T any] (t T) T {
	var x T
	return x
}

type MyInt int
type IntAlias = int

func main() {
	f[int](5)
	f[MyInt](5)
	f[IntAlias](5)
	f[*int](nil)
	f[*MyInt](nil)
	f[interface{}](nil)
}

```

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

后面这一段真的是迷惑发言(issue 里有些人也对这段提出疑问)，提案作者认为如果 `parameterized methods` 不参与 interface 的实现（相当于在 interface 中禁用 `parameterized methods` 了）, 那为啥还需要 `parameterized method`，因为所有的 `parameterized method` 都可以用 `parameterized function` 实现？？？？

难不成作者认为 `func (S[T]) F[ M, U] ( M ) U` 可以简单等效为 `func F[T, M, U] (T, M) U` ，所以调用方式 `x.f(y).g(z)` 和 `g(f(x,y),z)` 没区别 🤔？那 go 语言写起来那么啰嗦的原因找到了(。 具体来说请看这个[评论](https://github.com/golang/go/issues/49085#issuecomment-995993517) 。

后面作者的补充也很迷惑: [proposal: spec: allow parameterized methods in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-1291237249)，不予置评了。

### 讨论

由于之后的讨论太长，所以接下来省略部分评论(有些不是关于泛型的讨论)并且根据 issue 里提出的不同解决方案进行分类。

#### gava派

> I think that the example issue can be approached the same way as Java does: using `interface{}` behind the scenes and panic if the customer did a bad assignment (also the compiler could warn about the unsafe operation). --[link](https://github.com/golang/go/issues/49085#issuecomment-986056824)

> How about using type erasure to handle the generic method issue? --[link](https://github.com/golang/go/issues/49085#issuecomment-1857277699)

interface 代表一切！不过显然 gava 和 anygo 是不行滴。

#### 语法糖派(投降派)

> Maybe add some syntactic sugar like extension methods in C#. --[link](https://github.com/golang/go/issues/49085#issuecomment-1064889791)

> Something similar that's been proposed before and is more explicit and thus feels, at least to me, more Go-like is to add a new operator, such as `->` or `|>`, that chains functions such that `a -> f(b, c)` is equivalent to `f(a, b, c)`. That would allow the benefit of a method-like ordering to the execution without needing to actually support methods with extra types or method implementations for interface types. --[link](https://github.com/golang/go/issues/49085#issuecomment-1278630794)

> For the solution [#49085 (comment)](https://github.com/golang/go/issues/49085#issuecomment-1464887534), the problem is that functions with `infix` are different from normal functions, and it may requires to write a function twice to provide both forms. I'd like to have a new way to call a function at the right position of a value, like [using `|`](https://pkg.go.dev/text/template#hdr-Examples) in `template`. So I propose following: --[link](https://github.com/golang/go/issues/49085#issuecomment-1600571377)

这一派对 go 语言的泛型彻底的妥协，不要求改变目前的泛型现状，只要求添加一个中缀调用的语法糖(不过这个也老早被 go 团队打了回去)。

在之前提到过，虽然不支持泛型方法 ， `func (S[T]) F[ M, U] ( M ) U` 也可以由 `func F[T, M, U] (T, M) U` 替换，但是随之而来的是深层次的调用嵌套，由原本的 `x.f(y).g(z)` 变成了 `g(f(x, y), z)` 。如果有一种中缀语法糖 `x -> f(y)` 表达 `f(x,y)`，那么 `g(f(x, y), z)` 就能变成 `x -> f(y) -> g(z)`，调用嵌套就没有了，流式调用看起来也能写了。(这很难评，加这种晦涩的函数式语法糖不如改进一下泛型)

#### xx派(想不出名字了)

首先因为 go 团队的 less is more 理念，让编译器做分析调用链这么重的活也不太现实（这里也辩解一下，即使调用链分析也无法覆盖反射、传 interface 调用、[插件模式](https://pkg.go.dev/plugin)等场景，所以调用链分析是不现实的）。

但是禁用整个泛型方法也太过极端了，如果只禁用 interface 中的 `parameterized methods` ，而放过成员方法的 `parameterized methods` ，我认为有几点好处吧:

1. 最重要的一点是向下兼容，这种修改没有对 go 的语义有重大改变，同时是大范围约束到小范围约束的过程，不会影响以前的代码运行。
2. **可以用上 monad and stream call** 。众所周知，合理地使用函数式能够减少临时变量和冗长的代码。有较大概率能减少下图中的代码(什么时候才能看到这张图不吐槽呢。。。)
![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/20231224210233.png)
3. 实现起来相对的不是特别复杂(相较于分析调用链来说)，因为泛型结构本身是可以具有方法的，也许可能再支持一个泛型方法相对来说没那么困难?

以上为笔者个人观点。实际上，这一派为 issue 中大多数人的观点，其中有几位有较深入的讨论，下面对他们的讨论做下分析:

###### 一

> I think this solution makes the most sense. They could then (under the hood) be treated a regular function. The reason why this would be useful is that methods do not only serve the purpose of implementing interfaces; methods also serve as a means of organization for functions that operate on particular structures.
> It may be a bit of a challenge about how type-parameterized methods would appear in `"reflect"`, though. ---- [link](https://github.com/golang/go/issues/49085#issuecomment-948108705)

把这段话放到第一个的原因是这是第一个提出这一派观点的人，还顺便吐槽了下提案中的 "any parameterized method can be implemented as a parameterized function"。

##### 二

#### 反对派

[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-952701440)

[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-1280087495)

[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-1281552328)

[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085#issuecomment-1290043476)

## 总结

考虑到 go 语言团队已经在泛型实现上已经[考虑了 10 年](https://github.com/golang/go/issues/49085#issuecomment-1290106303)达到如今的成就，那么希望 go 团队能在不违反"[泛型方法在 interface 中的正交性](https://github.com/golang/go/issues/49085#issuecomment-1291237249)🤗"的约束下在下个 10 年实现泛型方法吧。在此之前，如果各位看官想使用泛型方法，请看下面评论(

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img@main/20240228131110.png)
