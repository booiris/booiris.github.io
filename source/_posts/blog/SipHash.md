---
title: SipHash
date: 2023-10-13 13:36:05
updated: 2023-10-19 23:13:49
tags:
  - hash
top: false
mathjax: true
categories:
  - blog
author: booiris
---
> 论文 [eprint.iacr.org/2012/351.pdf](https://eprint.iacr.org/2012/351.pdf)

> 代码位置 [library/core/src/hash/sip.rs](https://github.com/rust-lang/rust/blob/1.72.0/library/core/src/hash/sip.rs)

SipHash 是一类针对短消息设计的伪随机函数族，其提出用于解决 [hash dos 攻击](../todo/todo.md)。

## 实现

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash1.png)

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash2.png)

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash3.png)

## 安全性分析
