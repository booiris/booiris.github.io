---
title: 使用 rust 游玩 cf 的姿势
date: 2024-03-15 21:36:47
updated: 2024-03-23 00:30:20
tags: 
top: false
mathjax: true
categories:
  - blog
author: booiris
---

## cf 是什么

具体来说就是

> ~~穿越火线是一款非常受欢迎的第一人称射击网络游戏，它也被称作"CrossFire"。它最早由韩国SmileGate公司开发，后来在中国由腾讯公司运营。这个游戏在中国有着庞大的玩家基础，在亚洲其他地区以及全球也有相当多的粉丝。~~
>
> ~~游戏提供了多种模式，包括经典的团队对战、爆破模式、生化模式等。玩家能选择成为全球反恐精英的一员，或者加入恐怖分子阵营。在游戏中，玩家可以购买和升级各种武器装备，与队友协同作战，完成不同的任务和挑战。~~

>   Codeforces 是一个在线编程和算法竞赛平台，广受全球程序员和算法爱好者的欢迎。它提供了一个平台，用户可以通过参加定期举办的编程比赛来提高自己的编程技能和算法知识。这些比赛通常分为几个不同的难度等级，适合从初学者到高级程序员的各个水平。
>
>   在Codeforces上，参赛者需要在限定时间内解决一系列编程问题。这些问题覆盖了数据结构、算法、数学、字符串处理、图论等众多领域。参赛者的表现根据解决问题的速度和正确性来评分，并在全球范围内进行排名。 -- chatgpt 生成

网站: [Codeforces](https://codeforces.com/)

## rust 是什么

具体来说就是

> ~~《Rust》是一款多人生存游戏，玩家需收集资源，建造庇护所，与环境和其他玩家互动以求生存。游戏以其开放世界、真实的生存挑战和玩家之间的复杂互动闻名。~~

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

在之后是一个宏，用于优化使用体验。然而一定会使用到全局变量，rust 中对于全局变量的使用较为繁琐，这里采用两种方法:

1. 使用全局裸指针，使用 `box::leak` 将读取器内存泄漏，然后将裸指针指向这块内存进行调用，不过这个需要用到 unsafe ，由于 codeforces 算法都为单线程，所以不用考虑并发问题，所以这个 unsafe 是可控的。
2. 使用 `RefCell` 获取内部可变性。

通常来说，应该是使用全局裸指针性能更好，因为 `RefCell` 会在运行期进行借用检测。但经测试两者的性能差距不明显，所以读者自行选择。

[全局读取器使用裸指针和 refcell 性能测试 · GitHub](https://gist.github.com/booiris/68b0def25da4d820b52a65bebe3017eb)

```rust
// RefCell 方式的全局变量
thread_local! {
    pub static STDIN: std::cell::RefCell<Scanner<StdinLock<'static>>> =
    std::cell::RefCell::new(Scanner::new(io::stdin().lock()));
}
#[allow(unused_macros)]
macro_rules! safe_i {
    () => {{
        safe_i!(i32)
    }};
    ($t:ty) => {
        STDIN.with(|r| {
            let mut r = r.borrow_mut();
            r.sc::<$t>()
        })
    };
}
```

---

除了上面的解决方式之外，讨论中还出现了一种[解决方式](https://codeforces.com/blog/entry/67391?#comment-515870)，具体实现原理基本上和 c++ 的[快读方式](https://oi-wiki.org/contest/io/#%E8%AF%BB%E5%85%A5%E4%BC%98%E5%8C%96)相似，然后通过把快读封装成 trait，给基本类型使用宏实现快读的 trait 实现数据的读入。理论上这种读取方式应该更快，请读者自行取用。

### 处理输出

对于输出也需要特殊处理一下，使用普通的 `println!` 宏可能会导致输出时间过长导致超时。原因是[每次调用 `println!` 的时候都会给标准输出上锁](https://doc.rust-lang.org/std/macro.println.html)。遇到需要许多输出的题目可能会因为频繁上锁解锁导致输出时间过长。

`println!` 的注释中也提到可以使用 `writeln!` 宏进行输出。对于输出加锁导致变慢的问题可以使用缓冲区解决。将输出保存到缓冲区中，最后调用 `flush!` 将缓冲区的内容写入输出流，这样就减少了加锁解锁的时间，实现了快速输出。

```rust
static mut OUT: *mut std::io::BufWriter<std::io::StdoutLock<'_>> = std::ptr::null_mut();
#[allow(unused_macros)]
macro_rules! w {
    ($fmt:expr) => {
    unsafe{ write!(*OUT, "{}", $fmt);}
    };
    ($fmt:expr, $($args:tt)*) => {
    unsafe{  write!(*OUT, $fmt, $($args)*);}
    };
}
#[allow(unused_macros)]
macro_rules! wln {
    () => {
    unsafe{ writeln!(*OUT);}
    };
    ($fmt:expr) => {
    unsafe{ writeln!(*OUT, "{}", $fmt);}
    };
    ($fmt:expr, $($args:tt)*) => {
    unsafe{  writeln!(*OUT, $fmt, $($args)*);}
    };
}
#[allow(unused_macros)]
macro_rules! flush {
    () => {
        unsafe {
            (*OUT).flush();
        }
    };
}

fn main(){
    OUT = Box::leak(Box::new(io::BufWriter::new(io::stdout().lock())))
            as *mut std::io::BufWriter<std::io::StdoutLock<'_>>;
    let a: i32 = 1;
    wln!();    // 输出 \n
    wln!(a);  // 输出 1\n
    w!(a);    //  输出 1
    wln!("test: {}",a); // 输出 test: 1\n 
    flush!(); // 最后需要调用 flush 将数据输入到缓冲区
}
```

同样的，对应输出器的全局变量也有两种写法，一种 `static mut` 的全局变量，一种是 `Refcell` ，这里作为思考题请读者自行实现。

### 处理随机数

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
struct Rand {
    s: [u64; 4],
}

impl Rand {
    pub fn new(mut state: u64) -> Self {
        const PHI: u64 = 0x9e3779b97f4a7c15;
        let mut seed = <[u64; 4]>::default();
        for chunk in &mut seed {
            state = state.wrapping_add(PHI);
            let mut z = state;
            z = (z ^ (z >> 30)).wrapping_mul(0xbf58476d1ce4e5b9);
            z = (z ^ (z >> 27)).wrapping_mul(0x94d049bb133111eb);
            z = z ^ (z >> 31);
            *chunk = z;
        }
        Self { s: seed }
    }

    #[inline]
    pub fn next_u32(&mut self) -> u32 {
        (self.next_u64() >> 32) as u32
    }

    #[inline]
    pub fn next_u64(&mut self) -> u64 {
        let result_plusplus = self.s[0]
            .wrapping_add(self.s[3])
            .rotate_left(23)
            .wrapping_add(self.s[0]);

        let t = self.s[1] << 17;
        self.s[2] ^= self.s[0];
        self.s[3] ^= self.s[1];
        self.s[1] ^= self.s[2];
        self.s[0] ^= self.s[3];
        self.s[2] ^= t;
        self.s[3] = self.s[3].rotate_left(45);
        result_plusplus
    }
}
```

[Submission #252682933 - Codeforces](https://codeforces.com/contest/1310/submission/252682933)

[vigna.di.unimi.it/ftp/papers/ScrambledLinear.pdf](http://vigna.di.unimi.it/ftp/papers/ScrambledLinear.pdf)

### 图模板

[图结构性能测试 · GitHub](https://gist.github.com/booiris/cf5cc7dbec64051e62244ca9143e8a5d)

### 树模板

### 柯里化

柯里化在算法题中使用不多，大部分作用都是为了保存局部变量，用于传递给函数(由于 rust 不鼓励使用全局变量，所以容易导致传递较多的变量)。当然这种功能也能使用闭包实现，就请读者自行取用吧。使用方法参见:


```rust
#[allow(unused_macros)]
macro_rules! curry2 (
    ($f:expr) => {
        |a| move |b|  $f(a, b)
    };
);

#[allow(unused_macros)]
macro_rules! curry3 (
    ($f:expr) => {
        |a| move |b| move |c| $f(a, b, c)
    };
);
```
