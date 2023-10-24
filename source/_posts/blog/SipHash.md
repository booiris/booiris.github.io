---
title: SipHash
date: 2023-10-13 13:36:05
updated: 2023-10-25 00:57:25
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

SipHash 是一类针对短消息设计的伪随机函数族，相较于其他的哈希函数有在短消息上性能高、由于随机输入的存在难以构造[哈希 dos 攻击](../todo/todo.md)的优点，是 rust 、python 的内置哈希函数实现。

## 实现

对于 SipHash-c-d 函数族，输入为一个 128 bit 的 `k` 和 可为空的输入 `m`，输出为一个 64 位长度的 `SipHash-c-d(k,m)`。其中 `c` 为 "compression rounds" 的次数， `d` 为 "finalization rounds" 的次数，"compression rounds" 和 "finalization rounds" 为算法中的哈希步骤，在之后中有说明具体的实现步骤。

### 初始化

首先使用 `k0`、`k1` 初始化四个值 `v0` 、`v1` 、`v2` 、`v3`，其中 `k0`、`k1` 为 输入 `k` 的 64 位的小端编码 (也就是两个 u64 值 `k0` 、`k1` 组成了 `k` )。

对于其中的常量，论文的选取解释为:

> The initial state constant corresponds to the ASCII string "somepseudorandomlygeneratedbytes", big-endian encoded.

论文中提出只需要满足 `v0` 和 `v1` 不同于 `v2` 和 `v3` 即可(也没分析为啥。。。)。

> the only requirement was some asymmetry so that the initial v0 and v1 differ from v2 and v3.

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash1.png)

### SpiRound 迭代

在初始化状态后，需要将

巨💩🤡的是论文中的 "For example, the one-byte input string m = ab is parsed as m0 = 01000000000000ab"。开始我还以为输入的是字符串 "ab"，没看到 "one-byte input"，导致编码输入 m 这块卡了一会。感觉写成 "0xab" 和 "0x01000000000000ab" 会好一点🤡。

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash2.png)

### 整体迭代步骤

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/spihash3.png)

## 安全性分析

## rust 实现细节
