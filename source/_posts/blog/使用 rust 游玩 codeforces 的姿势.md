---
title: 使用 rust 游玩 codeforces 的姿势 
date: 2024-03-15 21:36:47 
updated: 2024-03-16 21:05:45
tags: [] 
top: false
mathjax: true
categories: [ blog ]
author: booiris
---

## codeforces 是什么

具体来说就是

>   Codeforces 是一个在线编程和算法竞赛平台，广受全球程序员和算法爱好者的欢迎。它提供了一个平台，用户可以通过参加定期举办的编程比赛来提高自己的编程技能和算法知识。这些比赛通常分为几个不同的难度等级，适合从初学者到高级程序员的各个水平。
>
>   在Codeforces上，参赛者需要在限定时间内解决一系列编程问题。这些问题覆盖了数据结构、算法、数学、字符串处理、图论等众多领域。参赛者的表现根据解决问题的速度和正确性来评分，并在全球范围内进行排名。 -- chatgpt 生成

网站: [Codeforces](https://codeforces.com/)

## rust 是什么

具体来说就是

> Rust是一种开源的系统编程语言，以安全性、速度和并发性为设计目标。它旨在帮助开发者构建高效、可靠的软件，同时避免常见的内存安全错误，如缓冲区溢出。Rust通过一套严格的编译时检查机制实现这些目标，而无需依赖于传统的垃圾回收机制或大量的运行时检查。
>
> Rust的设计充分考虑了现代硬件的特性，提供了零成本抽象、安全的并发编程模型，以及对内存布局的精细控制。这些特性使Rust成为开发操作系统、游戏引擎、浏览器组件以及需要高性能和高可靠性的应用程序的理想选择。 -- chatgpt 生成

网站: [Rust Programming Language](https://www.rust-lang.org/)

## 正文

相较于 c++ 的 `scanf` 、`cin` ，rust 的标准库中缺少一种方便地从标准输入中读取并构造数据的方法，网上也存在一些讨论:

1. [Why is it so difficult to get user input in Rust? - help - The Rust Programming Language Forum](https://users.rust-lang.org/t/why-is-it-so-difficult-to-get-user-input-in-rust/27444/11)
2. [Why is it so painful to read user inputs in Rust](https://www.reddit.com/r/rust/comments/ifpi8p/why_is_it_so_painful_to_read_user_inputs_in_rust/)
3. [Why is it so painful to read user inputs in Rust](https://www.reddit.com/r/rust/comments/8lfuh7/why_isnt_there_an_easy_way_to_get_input_in_std_as/)

所以使用 rust 解决 codeforces 