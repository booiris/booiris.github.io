---
title: 1051-Height Checker 
date: 2022-06-13 15:00:05 
updated: 2022-06-13 15:05:05
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:  1051    # add order, base on problem number.
---

## 题意

A school is trying to take an annual photo of all the students. The students are asked to stand in a single file line in non-decreasing order by height. Let this ordering be represented by the integer array expected where expected[i] is the expected height of the ith student in line.

You are given an integer array heights representing the current order that the students are standing in. Each heights[i] is the height of the ith student in line (0-indexed).

Return the number of indices where heights[i] != expected[i].

## 题解

排序原数组，对应位置不同的计数加一，返回最终不同元素的计数。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    int heightChecker(vector<int> &heights) {
        vector<int> temp(heights);
        sort(heights.begin(), heights.end());
        int res = 0;
        for (int i = 0; i < heights.size(); i++) {
            if (heights[i] != temp[i])
                res++;
        }
        return res;
    }
};
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif

```
