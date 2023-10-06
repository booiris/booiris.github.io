---
title: 1089-Duplicate Zeros 
date: 2022-06-17 16:13:02 
updated: 2022-06-19 14:07:40
tags: [双指针] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order: 1089    # add order, base on problem number.
---

## 题意

给你一个长度固定的整数数组 arr，请你将该数组中出现的每个零都复写一遍，并将其余的元素向右平移。

注意：请不要在超过该数组长度的位置写入元素。

要求：请对输入的数组 就地 进行上述修改，不要从函数返回任何东西，空间复杂度为 $O(1)$。

## 题解

使用双指针，通过维护两个双指针模拟栈。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    void duplicateZeros(vector<int> &arr) {
        int now = 0, top = 0;
        while (top < arr.size()) {
            if (arr[now] == 0)
                top++;
            now++, top++;
        }
        while (now > 0) {
            now--, top--;
            if (arr[now] == 0) {
                if (top < arr.size())
                    arr[top] = 0;
                top--;
            }
            arr[top] = arr[now];
        }
    }
};
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
