---
title: rust 源码分析 (6)-std-collection-HashMap
date: 2023-10-05 16:32:12
updated: 2023-10-13 22:15:52
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
> rust 源码版本: [1.72.0](https://github.com/rust-lang/rust/tree/1.72.0)

## 文件位置

> [library/std/src/collections/hash/map.rs](https://github.com/rust-lang/rust/blob/1.72.0/library/std/src/collections/hash/map.rs)

`HashMap` 和 `HashSet` 位于 `std` 库中， 而其余的容器则在 `alloc` 库中，由 `std` 库重导出。

原因参考 [Move HashMap to liballoc · Issue #27242 · rust-lang/rust · GitHub](https://github.com/rust-lang/rust/issues/27242)

> hashbrown itself is `#[no_std]` since it uses a non-HashDOS-safe hasher. The std shim is what adds the SipHash hasher which depends on randomness and TLS.

可能是哈希的实现方法依赖于系统的随机数发生器，所以 `HashMap` 和 `HashSet` 需要放到 `std` 库中。

## 实现

### 数据结构

#### HashMap

```rust
pub struct HashMap<K, V, S = RandomState> {
    base: base::HashMap<K, V, S>,
}
```

其中 `K`、`V` 、`S` 分别表示键类型、值类型和哈希函数。`std` 的 `hashMap` 实际上的底层实现实际上是 [GitHub - rust-lang/hashbrown](https://github.com/rust-lang/hashbrown) (`1.72.0` 的 rust 依赖版本为 `0.14`)。

#### 常规迭代器

```rust
pub struct Iter<'a, K: 'a, V: 'a> {
    base: base::Iter<'a, K, V>,
}

pub struct IterMut<'a, K: 'a, V: 'a> {
    base: base::IterMut<'a, K, V>,
}

pub struct IntoIter<K, V> {
    base: base::IntoIter<K, V>,
}

pub struct Drain<'a, K: 'a, V: 'a> {
    base: base::Drain<'a, K, V>,
}
```

基础的迭代器实现就是 `hashbrown` 的套了一层实现。

#### Keys/Values

```rust
pub struct Keys<'a, K: 'a, V: 'a> {
    inner: Iter<'a, K, V>,
}

pub struct IntoKeys<K, V> {
    inner: IntoIter<K, V>,
}

pub struct Values<'a, K: 'a, V: 'a> {
    inner: Iter<'a, K, V>,
}

pub struct ValuesMut<'a, K: 'a, V: 'a> {
    inner: IterMut<'a, K, V>,
}

pub struct IntoValues<K, V> {
    inner: IntoIter<K, V>,
}
```

#### 其他

```rust
pub struct ExtractIf<'a, K, V, F>
where
    F: FnMut(&K, &mut V) -> bool,
{
    base: base::ExtractIf<'a, K, V, F>,
}

pub struct RawEntryBuilderMut<'a, K: 'a, V: 'a, S: 'a> {
    map: &'a mut HashMap<K, V, S>,
}

pub struct RawOccupiedEntryMut<'a, K: 'a, V: 'a, S: 'a> {
    base: base::RawOccupiedEntryMut<'a, K, V, S>,
}

pub struct RawVacantEntryMut<'a, K: 'a, V: 'a, S: 'a> {
    base: base::RawVacantEntryMut<'a, K, V, S>,
}

pub struct RawEntryBuilder<'a, K: 'a, V: 'a, S: 'a> {
    map: &'a HashMap<K, V, S>,
}
```

#### 默认随机函数实现

```rust
pub struct RandomState {
    k0: u64,
    k1: u64,
}

pub struct DefaultHasher(SipHasher13);
```

HashMap的默认哈希函数为 [SipHash](../../pages/blog/SipHash.md) ([eprint.iacr.org/2012/351.pdf](https://eprint.iacr.org/2012/351.pdf))。

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

哈希函数参数的初始化从注释中能看出有点说法，在最开始的时候

[Seed HashMaps thread-locally, straight from the OS. by huonw · Pull Request #31356 · rust-lang/rust · GitHub](https://github.com/rust-lang/rust/pull/31356)
