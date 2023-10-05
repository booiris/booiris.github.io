---
title: "rust 源码分析 (2)-core: 内存模块"
date: 2023-07-24 13:28:43
updated: 2023-10-05 2320::4959:50
tags:
  - rust
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: rust
order:  2   # add order, base on problem number.
---

> rust 源码版本: [1.72.0](https://github.com/rust-lang/rust/tree/1.72.0)

## 概述

## rust 指针

> 文件位置: [library/core/src/ptr](https://github.com/rust-lang/rust/tree/1.72.0/library/core/src/ptr)

文件结构

```bash
./
├── alignment.rs
├── const_ptr.rs
├── metadata.rs
├── mod.rs
├── mut_ptr.rs
├── non_null.rs
└── unique.rs
```

### mod

### metadata

#todo

- [ ] 太抽象了，还是看看远方的std库吧
