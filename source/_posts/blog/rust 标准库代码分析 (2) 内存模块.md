---
title: "rust 标准库代码分析 (2): 内存模块"
date: 2023-07-24 13:28:43
updated: 2023-09-23 00:36:50
tags:
  - rust
top: false
mathjax: true
categories:
  - blog
author: booiris
---

> rust 源码 tag: [1.72.0](https://github.com/rust-lang/rust/tree/1.72.0)

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

### metadata ()

元数据:
