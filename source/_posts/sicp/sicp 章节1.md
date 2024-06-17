---
title: sicp 章节1
date: 2024-06-15 13:46:41
updated: 2024-06-18 00:59:49
tags:
  - sicp
top: false
mathjax: true
categories:
  - sicp
author: booiris
katex: true
---

# 1. Building Abstractions With Procedures

sicp 前面部分介绍的内容还是比较基础的，具体是在介绍程序是什么。

> We are about to study the idea of a _computational process_. Computational processes are abstract beings that inhabit computers. As they evolve, processes manipulate other abstract things called _data_. The evolution of a process is directed by a pattern of rules called a _program_.
>
> -- _computational process_ (即计算过程) 是操作数据的过程，这一过程的实现由一组定义的规则(程序)完成。

从中可以看出编写的计算机程序有两个重要的元素:

1. 数据
2. 操作数据的行为

笔者认为我们编写的程序就是处理数据的过程，是对数据的各种加工变换(这就是为啥一个好的类型系统那么重要，土法炼钢不可取，此处@某一个大道至简的语言[为啥 go 不支持泛型方法](../blog/为啥%20go%20不支持泛型方法.md)😚)。

## 1.1 The elements of Programming

本节开始又到了最喜欢的概念定义环节，一个成熟的语言需要以下三种结构：

1. **primitive expressions**, which represent the simplest entities the language is concerned with,
2. **means of combination**, by which compound elements are built from simpler ones, and
3. **means of abstraction**, by which compound elements can be named and manipulated as units.

具体来说就是需要

1. 基本元素，即变量和一些基础的类型
2. 组合算子，即运算符和函数调用
3. 抽象方式，即函数定义和数据类型的定义，能够将一组过程或者数据类型封装合并为一个单元

之后，文中再次强调了程序中最重要的两个元素，过程和数据(但实际上过程也可以认为是一种数据(有没有函数是一等公民的即视感) )：

> In programming, we deal with two kinds of elements: procedures and data. (Later we will discover that they are really not so distinct.)

### 1.1.1 Expressions

基本上是在通过介绍 lisp 中的一些语法来阐释 expressions 这一概念（不过 lisp 是前缀表达式还真是反人类👾，当然把运算符当成函数调用看能好一点，也确实能更好表达函数复合等概念，但还是难受🤖）。

### 1.1.2 Naming and the Environment

介绍了 lisp 的变量定义方式，还捎带讲了下变量作用域的概念。

### 1.1.3 Evaluating Combinations

介绍了 lisp 计算表示的方式：

1. 计算表达式需要首先计算所有子表达式
2. 自左向右计算值

### 1.14 Compound Procedures
