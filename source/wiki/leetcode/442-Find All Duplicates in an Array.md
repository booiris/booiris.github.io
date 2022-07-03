---
title: 442-Find All Duplicates in an Array 
date: 2022-05-08 13:46:38 
updated: 2022-06-10 00:41:40
tags: [原地哈希] 
top: false
mathjax: true
author: booiris
layout: wiki 
wiki: leetcode 
order: 442
---

## 题意

给出一个长度为 n 的数组，每个数组元素的值为 [1,n], 数组中存在出现一次和出现两次的元素，要求在 $O(n)$ 时间和 $O(1)$ 空间返回出现两次的元素。

## 题解

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    vector<int> findDuplicates(vector<int> &nums) {
        vector<int> res;
        for (int i = 0; i < nums.size(); i++) {
            while (nums[i] != nums[nums[i] - 1])
                swap(nums[i], nums[nums[i] - 1]);
        }
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] - 1 != i)
                res.push_back(nums[i] - 1);
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
