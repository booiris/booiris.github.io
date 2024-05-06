---
title: rust 源码分析 (6)-std-collection-HashMap
date: 2023-10-05 16:32:12
updated: 2024-05-06 13:14:33
tags:
  - rust
top: false
mathjax: true
categories: []
author: booiris
layout: wiki
wiki: rust
order: 6
---
> rust 源码版本: [1.78.0](https://github.com/rust-lang/rust/tree/1.78.0)

## 文件位置

> [library/std/src/collections/hash/map.rs](https://github.com/rust-lang/rust/blob/1.78.0/library/std/src/collections/hash/map.rs)

`HashMap` 和 `HashSet` 位于 `std` 库中， 而其余的容器则在 `alloc` 库中，由 `std` 库重导出。

原因参考 [Move HashMap to liballoc · Issue #27242 · rust-lang/rust · GitHub](https://github.com/rust-lang/rust/issues/27242)

> hashbrown itself is `#[no_std]` since it uses a non-HashDOS-safe hasher. The std shim is what adds the SipHash hasher which depends on randomness and TLS.

可能是哈希的实现方法依赖于系统的随机数发生器，所以 `HashMap` 和 `HashSet` 需要放到 `std` 库中。

## 实现

### type

```rust
pub struct HashMap<K, V, S = RandomState> {
    base: base::HashMap<K, V, S>,
}
```

其中 `K`、`V` 、`S` 分别表示键类型、值类型和哈希函数。`std` 的 `hashMap` 实际上的底层实现实际上是 [GitHub - rust-lang/hashbrown](https://github.com/rust-lang/hashbrown) 。

由于 `hashMap` 内基本为 `hashbrown` 的封装，所以其中的常规函数和迭代器就省略不讲，下面讲一下其中有趣的地方。

### issue

HashMap的默认哈希函数为 [SipHash](../../pages/blog/SipHash.md) ，用的是 `SipHash-1-3` 。

下面这这段代码来自 [rust/library/std/src/hash/random.rs](https://github.com/rust-lang/rust/blob/9b00956e56009bab2aa15d7bff10916599e3d6d6/library/std/src/hash/random.rs#L55)，为默认哈希函数的实现。

```rust
    pub fn new() -> RandomState {
        // Historically this function did not cache keys from the OS and instead
        // simply always called `rand::thread_rng().gen()` twice. In #31356 it
        // was discovered, however, that because we re-seed the thread-local RNG
        // from the OS periodically that this can cause excessive slowdown when
        // many hash maps are created on a thread. To solve this performance
        // trap we cache the first set of randomly generated keys per-thread.
        //
        // Later in #36481 it was discovered that exposing a deterministic
        // iteration order allows a form of DOS attack. To counter that we
        // increment one of the seeds on every RandomState creation, giving
        // every corresponding HashMap a different iteration order.
        thread_local!(static KEYS: Cell<(u64, u64)> = {
            Cell::new(sys::hashmap_random_keys())
        });

        KEYS.with(|keys| {
            let (k0, k1) = keys.get();
            keys.set((k0.wrapping_add(1), k1));
            RandomState { k0, k1 }
        })
    }
```

哈希函数参数的初始化从注释中能看出有点说法，最初参数是在初始化随机数生成器后，调用两次随机数生成器分别生成`k0`，`k1` 两个参数，最初的代码为:

```rust
 pub fn new() -> RandomState {
        let mut r = rand::thread_rng();
        RandomState { k0: r.gen(), k1: r.gen() }
}
```

* rand 代码位于 [rust/src/libstd/rand/mod.rs](https://github.com/rust-lang/rust/blob/a59de37e99060162a2674e3ff45409ac73595c0e/src/libstd/rand/mod.rs#L159)

* randomState 代码位于 [rust/src/libstd/collections/hash/map.rs](https://github.com/rust-lang/rust/blob/a59de37e99060162a2674e3ff45409ac73595c0e/src/libstd/collections/hash/map.rs#L1613)

在 [#27243](https://github.com/rust-lang/rust/issues/27243) 和 [#31356](https://github.com/rust-lang/rust/pull/31356) 中提出，每个线程使用固定的随机数种子对于初始化速度有显著的提升(64倍)，最终在 [#33318](https://github.com/rust-lang/rust/pull/33318/files) 中这个改动被合入，代码为:

```rust
    pub fn new() -> RandomState {
        thread_local!(static KEYS: (u64, u64) = {
            let r = rand::OsRng::new();
            let mut r = r.expect("failed to create an OS RNG");
            (r.gen(), r.gen())
        });

        KEYS.with(|&(k0, k1)| {
            RandomState { k0: k0, k1: k1 }
        })
    }
```

这个 mr 的做法为为每个线程生成两个随机种子，之后的同一线程初始化的 HashMap 都使用固定的随机种子(这个操作有点骚气)。然后在 [#36481](https://github.com/rust-lang/rust/issues/36481) 中问题被逮住了，这种做法会被 Hash DoS attack。具体是这样的

[#37470](https://github.com/rust-lang/rust/pull/37470)

[#38368](https://github.com/rust-lang/rust/pull/38368)

### variance

为了让生命周期更为智能， rust 引入了子类型和变异性(**subtyping** and **variance**)，具体来说可以参考以下两个链接。

[子类型化和变异性 - Rust 秘典（死灵书）](https://nomicon.purewhite.io/subtyping.html)

[Subtyping and Variance - The Rustonomicon](https://doc.rust-lang.org/nomicon/subtyping.html)

可以看出 HashMap 的各种迭代器对于生命周期是协变的。

```rust
fn assert_covariance() {
    fn map_key<'new>(v: HashMap<&'static str, u8>) -> HashMap<&'new str, u8> {
        v
    }
    fn map_val<'new>(v: HashMap<u8, &'static str>) -> HashMap<u8, &'new str> {
        v
    }
    fn iter_key<'a, 'new>(v: Iter<'a, &'static str, u8>) -> Iter<'a, &'new str, u8> {
        v
    }
    fn iter_val<'a, 'new>(v: Iter<'a, u8, &'static str>) -> Iter<'a, u8, &'new str> {
        v
    }
    fn into_iter_key<'new>(v: IntoIter<&'static str, u8>) -> IntoIter<&'new str, u8> {
        v
    }
    fn into_iter_val<'new>(v: IntoIter<u8, &'static str>) -> IntoIter<u8, &'new str> {
        v
    }
    fn keys_key<'a, 'new>(v: Keys<'a, &'static str, u8>) -> Keys<'a, &'new str, u8> {
        v
    }
    fn keys_val<'a, 'new>(v: Keys<'a, u8, &'static str>) -> Keys<'a, u8, &'new str> {
        v
    }
    fn values_key<'a, 'new>(v: Values<'a, &'static str, u8>) -> Values<'a, &'new str, u8> {
        v
    }
    fn values_val<'a, 'new>(v: Values<'a, u8, &'static str>) -> Values<'a, u8, &'new str> {
        v
    }
    fn drain<'new>(
        d: Drain<'static, &'static str, &'static str>,
    ) -> Drain<'new, &'new str, &'new str> {
        d
    }
}
```
