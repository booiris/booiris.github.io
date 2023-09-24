---
title: "rust 源码分析 (1): RUST标准库体系概述"
date: 2023-07-24 13:27:31
updated: 2023-09-24 18:35:38
tags:
  - rust
top: false
mathjax: true
categories:
  - rust_src
author: booiris
---

> rust 源码版本: [1.72.0](https://github.com/rust-lang/rust/tree/1.72.0)

## rust 源码结构

代码结构如下

```bash
.
├── Cargo.lock
├── Cargo.toml
├── CODE_OF_CONDUCT.md
├── compiler
├── config.example.toml
├── configure
├── CONTRIBUTING.md
├── COPYRIGHT
├── library
├── LICENSE-APACHE
├── LICENSE-MIT
├── LICENSES
├── README.md
├── RELEASES.md
├── rustfmt.toml
├── rust-toolchain
├── src
├── target
├── tests
├── triagebot.toml
├── x
├── x.ps1
└── x.py
```

其中需要关注的是 `compiler` 、`library` 、`src` 这三个文件夹。

* `compiler` 文件夹包含了 rust 的编译器源代码，这里的代码实现了 Rust 语言的语法分析、类型检查、代码优化和代码生成等功能。

* `library` 包含了标准库的源代码，提供了许多常用的数据结构、函数和特性。

* `src` 文件夹中的 README 说明了该文件夹的用途。

> This directory contains some source code for the Rust project, including:
> * The bootstrapping build system
> * Various submodules for tools, like cargo, tidy, etc.

### rust 编译器

#todo

- [ ] 编译器

### rust 标准库

> 参考 [std - Rust](https://rustwiki.org/zh-CN/std/)



### rust 相关工程

#todo

- [ ] rust project
