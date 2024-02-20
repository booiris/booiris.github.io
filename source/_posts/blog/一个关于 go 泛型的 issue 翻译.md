---
title: 一个关于 go 泛型的 issue 翻译 
date: 2024-02-20 22:10:20 
updated: 2024-02-20 23:58:29
tags: [] 
top: false
mathjax: true
categories: [ blog ]
author: booiris
---

众所周知 go 的泛型是个残废，由于其不支持 `parameterized methods` (泛型方法不能作为函数参数)，导致其无法实现 monad、链式调用等等操作。在这个 issue 中 [proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085) 有着充分的讨论，本文旨在对其中的讨论进行翻译与分析，如有错误恳请斧正。

在看 issue 之前，首先介绍一下泛型的通常实现方式，一般有如下几种方式

1. **类型擦除**: 这是 Java 泛型的实现方式。在编译时，泛型类型信息会被擦除，所有的泛型被转换为基类 Object (在 go 中相当于将所有的类型变成 interface{} )，编译器同时会在必要时插入类型转换代码来确保类型安全。
2. **模板实例化**： C++ 使用模板来实现泛型。在编译时，模板会生成对应于每种具体类型的实例化代码。如 `T add(T a, T b) `的泛型方法，对于 `add(1,2)` 和 `add(1.0,2.0)` 会生成两个函数 `int add(int a, int b)` 和 `double add( double a, double b)` 。
3. **即时编译**: [How Generics Differ in Java and C# | HackerNoon](https://hackernoon.com/how-generics-differ-in-java-and-c) 依据此文所述，C# 是运行时根据

[Generics implementation - GC Shape Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-gcshape.md)

[Generics implementation - Stenciling](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-stenciling.md)

[Generics implementation - Dictionaries](https://go.googlesource.com/proposal/+/refs/heads/master/design/generics-implementation-dictionaries.md)
