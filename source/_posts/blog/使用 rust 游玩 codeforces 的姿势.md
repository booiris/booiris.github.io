---
title: 使用 rust 游玩 codeforces 的姿势 
date: 2024-03-15 21:36:47 
updated: 2024-03-17 21:20:30
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

rust 标准库只提供了一些基本和常用的数据结构和一套特性，所以可能需要手动造一些轮子，比如处理输入和随机数生成等等，下面将介绍对应的实现代码。

### 处理输入

相较于 c++ 的 `scanf` 、`cin` ，rust 的标准库中缺少一种方便地从标准输入中读取并构造数据的方法，网上也存在一些讨论:

1. [Why is it so difficult to get user input in Rust? - help - The Rust Programming Language Forum](https://users.rust-lang.org/t/why-is-it-so-difficult-to-get-user-input-in-rust/27444/11)
2. [Why is it so painful to read user inputs in Rust](https://www.reddit.com/r/rust/comments/ifpi8p/why_is_it_so_painful_to_read_user_inputs_in_rust/)
3. [Why is it so painful to read user inputs in Rust](https://www.reddit.com/r/rust/comments/8lfuh7/why_isnt_there_an_easy_way_to_get_input_in_std_as/)

所以使用 rust 解决 codeforces 中的问题所遇到的第一个困难就是如何处理输入，所幸的是这个问题在[这里](https://codeforces.com/blog/entry/67391)有所讨论，具体的解决方法参考这个[回复](https://codeforces.com/blog/entry/67391?#comment-516341)。根据讨论中的代码修改，笔者使用的模板代码如下:

```rust
pub struct Scanner<B> {
    reader: B,
    buf_str: Vec<u8>,
    buf_iter: std::str::SplitWhitespace<'static>,
}
impl<B: BufRead> Scanner<B> {
    pub fn new(reader: B) -> Self {
        Self {
            reader,
            buf_str: Vec::new(),
            buf_iter: "".split_whitespace(),
        }
    }
    pub fn sc<T: std::str::FromStr>(&mut self) -> T {
        loop {
            if let Some(token) = self.buf_iter.next() {
                return token.parse().ok().expect("Failed parse");
            }
            self.buf_str.clear();
            self.reader
                .read_until(b'\n', &mut self.buf_str)
                .expect("Failed read");
            self.buf_iter = unsafe {
                let slice = std::str::from_utf8_unchecked(&self.buf_str);
                std::mem::transmute(slice.split_whitespace())
            }
        }
    }
}

static mut IN: *mut Scanner<StdinLock<'static>> = std::ptr::null_mut();
#[allow(unused_macros)]
macro_rules! i {
    () => {{
        i!(i32)
    }};
    ($t:ty) => {{
        unsafe { (*IN).sc::<$t>() }
    }};
}

// 使用方法
fn main() {
	// 需要首先初始化全局的读入器。
    unsafe {
        IN = Box::leak(Box::new(Scanner::new(io::stdin().lock()))) as *mut Scanner<StdinLock<'_>>;
    }
	let t = i!(String); // 从标准输入中读入一个 string。
	let a = i!();    //  默认读入的类型为 i32。
}
```

下面大致解释一下代码的实现，首先核心的是一个名为 `Scanner` 的结构体，其中的 `Reader` 保存了数据的来源，它是一个 trait ，可以认为是任意实现了 `std::io::BufRead` 这一"规范"的结构体。具体到本代码则为标准输入流。`buf_str` 则是用于储存从 reader 中获取的数据(每次以行为单位读取数据)。`buf_iter` 用于解析和迭代遍历行内的数据。

一个读入的过程为: 从 `Reader` 中根据换行符为分隔读取数据，保存到 `buf_str` 中，然后根据空白符做切分保存到 `buf_iter` 中，然后对每一块做解析转换成需要的格式。

下面是一个宏，用于优化使用体验。

---

除了上面的解决方式之外，讨论中还出现了一种[解决方式](https://codeforces.com/blog/entry/67391?#comment-515870)，具体实现原理基本上和 c++ 的[快读方式](https://oi-wiki.org/contest/io/#%E8%AF%BB%E5%85%A5%E4%BC%98%E5%8C%96)相似，然后通过把快读封装成 trait，给基本类型使用宏实现快读的 trait 实现数据的读入。理论上这种读取方式应该更快，请读者自行取用。

### 处理输出

### 处理随机数
