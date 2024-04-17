---
title: 1302-Deepest Leaves Sum 
date: 2022-08-17 20:21:22 
updated: 2022-09-11 16:10:43
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:   1302   # add order, base on problem number.
---

## 题意

给出一个二叉树，计算最深一层的节点和。

## 题解

dfs，如果当前的层数大于最大层数，则更新最大层数，并且重置节点和。当当前层数等于最大层数的时候，将当前节点值加入节点和。

```rust
#[allow(dead_code)]
#[allow(unused_imports)]
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

// Definition for a binary tree node.
#[cfg(feature = "local")]
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
#[cfg(feature = "local")]
impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode {
            val,
            left: None,
            right: None,
        }
    }
}

fn dfs(now: Option<Rc<RefCell<TreeNode>>>, depth: i32, maxdepth: &mut i32, key: &mut i32) {
    if let Some(ref x) = now {
        if depth > *maxdepth {
            *maxdepth = depth;
            *key = 0;
        }
        if depth == *maxdepth {
            *key += x.borrow().val;
        }
        dfs(x.borrow_mut().left.take(), depth + 1, maxdepth, key);
        dfs(x.borrow_mut().right.take(), depth + 1, maxdepth, key);
    }
}

use std::cell::RefCell;
use std::rc::Rc;
impl Solution {
    pub fn deepest_leaves_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut maxdepth = 0;
        let mut key = 0;
        dfs(root, 0, &mut maxdepth, &mut key);
        key
    }
}

#[cfg(feature = "local")]
pub fn main() {
    println!("res:");
}

```
