---
title: SipHash
date: 2023-10-13 13:36:05
updated: 2023-10-23 13:11:19
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

SipHash 是一类针对短消息设计的伪随机函数族，其提出用于解决 [hash dos 攻击](../todo/todo.md)，是 rust 、python 的内置哈希函数实现。

## 实现

对于 SipHash-c-d 函数族，输入为一个 128 bit 的 `k` 和 可为空的输入 `m`，输出为一个 64 位长度的 `SipHash-c-d(k,m)`。其中 `c` 为 "compression rounds" 的次数， `d` 为 "finalization rounds" 的次数。

### 初始化

首先使用 `k0`、`k1` 初始化四个值 `v0` 、`v1` 、`v2` 、`v3`，其中 `k0`、`k1` 为 输入 `k` 的 64 位的小端编码(也就是两个 u64 值 `k0` 、`k1`

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash1.png)

### SpiRound 迭代

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash2.png)

### 整体迭代步骤

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash3.png)

## 安全性分析
