---
title: rust 源码分析 (5)-std-collection
date: 2023-10-05 16:32:00
updated: 2023-10-06 13:32:53
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

> [library/std/src/collections/mod.rs](https://github.com/rust-lang/rust/blob/1.72.0/library/std/src/collections/mod.rs)

## 介绍

> 参考 [std::collections - Rust](https://doc.rust-lang.org/std/collections/index.html)

rust 标准库实现了一些常见的数据结构:

1. 数组 `Vec`
2. 双端数组 `VecDeque`
3. 链表 `LinkedList`
4. 哈希map `HashMap`
5. 按键排序map [`BTreeMap`](./rust%20源码分析%20(6)-std-collection-HashMap.md)
6. 哈希set `HashSet`
7. 按键排序set `BTreeSet`
8. 优先队列 `BinaryHeap`

## Tips

### Performance

Sequences :

|                | get(i)                 | insert(i)               | remove(i)              | append    | split_off(i)           |
|----------------|------------------------|-------------------------|------------------------|-----------|------------------------|
| [`Vec`]        | *O*(1)                 | *O*(*n*-*i*)*           | *O*(*n*-*i*)           | *O*(*m*)* | *O*(*n*-*i*)           |
| [`VecDeque`]   | *O*(1)                 | *O*(min(*i*, *n*-*i*))* | *O*(min(*i*, *n*-*i*)) | *O*(*m*)* | *O*(min(*i*, *n*-*i*)) |
| [`LinkedList`] | *O*(min(*i*, *n*-*i*)) | *O*(min(*i*, *n*-*i*))  | *O*(min(*i*, *n*-*i*)) | *O*(1)    | *O*(min(*i*, *n*-*i*)) |

Map :

|              | get           | insert        | remove        | range         | append       |
|--------------|---------------|---------------|---------------|---------------|--------------|
| [`HashMap`]  | *O*(1)~       | *O*(1)~*      | *O*(1)~       | N/A           | N/A          |
| [`BTreeMap`] | *O*(log(*n*)) | *O*(log(*n*)) | *O*(log(*n*)) | *O*(log(*n*)) | *O*(*n*+*m*) |

其中带 * 的为均摊复杂度，带 ~ 为期望复杂度。

### Capacity Management

* 使用 `with_capacity` 方法预先分配容器内存。

* 使用 `reserve` 方法扩容。

* 使用 `shrink_to_fit` 缩容。

### Iterators

通常用 `iter` 、 `iter_mut` 、`into_iter` 迭代容器。
