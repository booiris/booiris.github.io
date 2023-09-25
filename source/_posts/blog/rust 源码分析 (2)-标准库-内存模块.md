---
title: "rust 源码分析 (2)-标准库: 内存模块"
date: 2023-07-24 13:28:43
updated: 2023-09-24 18:42:6039:44
tags:
  - rust
top: false
mathjax: true
categories:
  - blog
author: booiris
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


### metadata (unstable)

元数据:
