---
title: 一个关于 go 泛型的 issue 翻译 
date: 2024-02-20 22:10:20 
updated: 2024-02-20 23:03:24
tags: [] 
top: false
mathjax: true
categories: [ blog ]
author: booiris
---

众所周知 go 的泛型是个残废，由于其不支持 `parameterized methods` (泛型方法不能作为函数参数)，导致其无法实现 monad、链式调用等等操作。在这个 issue 中 [proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085) 有着充分的讨论，本文旨在对其中的讨论进行翻译与分析，如有错误恳请斧正。

在看 issue 之前，首先介绍一下泛型的通常实现方式，一般分为两种:

[Generics implementation - GC Shape Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-gcshape.md)

[Generics implementation - Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-stenciling.md)

[Generics implementation - Dictionaries](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-dictionaries.md)