---
title: 1157-Online Majority Element In Subarray 
date: 2023-04-16 14:41:57 
updated: 2023-04-16 14:45:09
tags: [线段树,树套树] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:  1157    # add order, base on problem number.
---

## 题意

设计一个数据结构，有效地找到给定子数组的 **多数元素** 。

子数组的 **多数元素** 是在子数组中出现 `threshold` 次数或次数以上的元素。

实现 `MajorityChecker` 类:

* `MajorityChecker(int[] arr)` 会用给定的数组 `arr` 对 `MajorityChecker` 初始化。

* `int query(int left, int right, int threshold)` 返回子数组中的元素  `arr[left…right]` 至少出现 `threshold` 次数，如果不存在这样的元素则返回 `-1`。

## 题解

```rust
#![allow(dead_code, unused_imports, unused_macros)]
use std::cmp::*;
use std::collections::*;
use std::ops::Bound::*;
#[cfg(feature = "local")]
struct Solution;

macro_rules! hashmap {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::std::collections::HashMap::new();
         $( map.insert($key, $val); )*
         map
    }}
}

struct MajorityChecker {}

/**
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MajorityChecker {
    fn new(arr: Vec<i32>) -> Self {
        MajorityChecker {}
    }

    fn query(&self, left: i32, right: i32, threshold: i32) -> i32 {
        todo!()
    }
}

/**
 * Your MajorityChecker object will be instantiated and called as such:
 * let obj = MajorityChecker::new(arr);
 * let ret_1: i32 = obj.query(left, right, threshold);
 */

#[cfg(feature = "local")]
pub fn main() {
    let arr = [1, 1, 2, 2, 1, 1];
    let obj = MajorityChecker::new(arr.into());
    let ini = [[0, 5, 4]];
    for x in ini {
        println!("res:{}", obj.query(x[0], x[1], ini[2]));
    }
}
```
