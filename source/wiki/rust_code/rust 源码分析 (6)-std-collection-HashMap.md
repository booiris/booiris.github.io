---
title: rust 源码分析 (6)-std-collection-HashMap
date: 2023-10-05 16:32:12
updated: 2023-10-13 00:03:10
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
```
