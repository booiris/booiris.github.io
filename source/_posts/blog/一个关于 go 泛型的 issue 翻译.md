---
title: 一个关于 go 泛型的 issue 翻译 
date: 2024-02-20 22:10:20 
updated: 2024-02-20 22:17:32
tags: [] 
top: false
mathjax: true
categories: [ blog ]
author: booiris
---

众所周知 go 的泛型是个残废，由于其不支持 `parameterized methods` (泛型方法不能作为函数参数)，导致其无法实现 monad、链式调用等等操作。在这个 issue 中[proposal: spec: allow type parameters in methods · Issue #49085 · golang/go · GitHub](https://github.com/golang/go/issues/49085)
