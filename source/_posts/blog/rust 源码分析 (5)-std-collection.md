---
title: rust 源码分析 (5)-std-collection
date: 2023-10-05 16:32:00
updated: 2023-10-05 17:00:41
tags:
  - rust
top: false
mathjax: true
categories:
  - blog
author: booiris
---
> rust 源码版本: [1.72.0](https://github.com/rust-lang/rust/tree/1.72.0)

## 文件位置

> [library/std/src/collections/mod.rs](https://github.com/rust-lang/rust/blob/1.72.0/library/std/src/collections/mod.rs)

> 参考 [std::collections - Rust](https://doc.rust-lang.org/std/collections/index.html)

rust 标准库实现了一些常见的数据结构:

1. 数组 `Vec`
2. 双端数组 `VecDeque`
3. 链表 `LinkedList`
4. 哈希map `HashMap`
5. 按键排序map [`BTreeMap`](./rust%20源码分析%20(6)-std-collection-HashMap.md)
6. 哈希set `HashSet`
7. 按键排序set `BTreeSet`
8. 优先队列 `BinaryHeap`
