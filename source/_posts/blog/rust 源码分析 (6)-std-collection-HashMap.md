---
title: rust 源码分析 (6)-std-collection-HashMap
date: 2023-10-05 16:32:12
updated: 2023-10-05 22:22:16
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

> [library/std/src/collections/hash/map.rs](https://github.com/rust-lang/rust/blob/1.72.0/library/std/src/collections/hash/map.rs)

`HashMap` 和 `HashSet` 位于 `std` 库中， 而其余的容器则在 `alloc` 库中，由 `std` 库重导出。

原因

* [Move HashMap to liballoc · Issue #27242 · rust-lang/rust · GitHub](https://github.com/rust-lang/rust/issues/27242)
