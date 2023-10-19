---
title: SipHash
date: 2023-10-13 13:36:05
updated: 2023-10-19 22:59:56
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

SipHash 是一种用于处理短内容的哈希函数，其提出用于解决 [hash dos 攻击](../todo/todo.md)。

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash1.png)

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash2.png)
