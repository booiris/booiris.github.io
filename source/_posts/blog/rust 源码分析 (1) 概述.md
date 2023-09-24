---
title: "rust 源码分析 (1): 概述"
date: 2023-07-24 13:27:31
updated: 2023-09-24 18:53:34
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

* `src` 文件夹中的 README 说明了该文件夹的用途，里面包含了 构建系统、rustdoc、cargo 等工具的源码。

> This directory contains some source code for the Rust project, including:
> * The bootstrapping build system
> * Various submodules for tools, like cargo, tidy, etc.

### rust 标准库

> 参考 [std - Rust](https://rustwiki.org/zh-CN/std/)

`library` 里包含两个关键的文件夹 `core` 、`std` ，可以发现他们导出的模块有部分重叠，下面是他们的一些关键区别。

1. **Core 模块** (`core`)：
	- `core` 模块是 Rust 的核心标准库，它包含了 Rust 语言的基本构建块和最基本的数据类型。
	- 这个模块是无依赖的，意味着它不依赖于操作系统或外部库。这使得 Rust 的核心功能可以在各种平台上使用。
	- `core` 模块中的功能通常被认为是“无标准库”环境下的 Rust，因为它不包括与操作系统交互、文件 I/O 等高级功能。
	- 该模块通常用于编写嵌入式系统、操作系统内核、WebAssembly 等不需要标准库的环境中的代码。
2. **Std 模块** (`std`)：
	- `std` 模块是 Rust 的标准库，它构建在 `core` 模块之上，并提供了更多的功能和功能性。
	- 这个模块依赖于操作系统和外部库，因此包括与文件系统、多线程、网络编程、输入输出等相关的功能。
	- `std` 模块通常用于编写大多数 Rust 应用程序，包括命令行工具、网络服务器、桌面应用程序等。
	- 它提供了标准的 Rust 抽象和类型，如 `Vec`、`String`、`HashMap` 等。

总之， `core` 是 Rust 的核心标准库，提供了基本的 Rust 语言构建块，而 `std` 是构建在 `core` 之上的标准库，提供了更多的高级功能和与外部环境的交互。

### rust 编译器

#todo

- [ ] 编译器

### rust 相关工程

#todo

- [ ] rust project
