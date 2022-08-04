---
title: 1403-Minimum Subsequence in Non-Increasing Order 
date: 2022-08-05 00:23:19 
updated: 2022-08-05 00:30:09
tags: [贪心] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:      # add order, base on problem number.
---

## 题意

给出一个数组，将数组分为两个部分，其中一个部分A和严格大于另一部分和，要求A部分尽可能短，如果先相同长度A的和尽可能大。

## 题解

从大到小排序数组，不断取出当前最大的数直到取出的数的和大于剩下的数的和。取出的数集即为答案。

```rust
#[allow(dead_code)]
#[allow(unused_imports)]
use std::cmp::*;
use std::collections::*;
use std::ops::Bound::*;

struct Solution;

macro_rules! hashmap {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::std::collections::HashMap::new();
         $( map.insert($key, $val); )*
         map
    }}
}

impl Solution {
    pub fn min_subsequence(mut nums: Vec<i32>) -> Vec<i32> {
        nums.sort_unstable();
        nums.reverse();
        let mut sum = nums.iter().sum();
        let mut res = vec![];
        let mut now = 0;
        for num in nums.iter() {
            now += *num;
            sum -= *num;
            res.push(*num);
            if now > sum {
                break;
            }
        }
        res
    }
}

#[cfg(test)]
pub fn main() {
    println!("res:{:?}", Solution::min_subsequence(vec![4, 3, 10, 9, 8]));
}
```
