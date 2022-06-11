---
title: 926-Flip String to Monotone Increasing 
date: 2022-06-11 14:27:11 
updated: 2022-06-11 14:32:38
tags: [前缀和] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order: 926      # add order, base on problem number.
---

## 题意

给定一串01串，能够对其每一位进行翻转，即0变1，1变0。要求最终得到一个不下降的01串，即000111111，求最小翻转次数。

## 题解

使用前缀和统计每一位左边0和1，和右边0和1的个数，枚举每一位 i 作为0到1上升的边缘。i 左边全为0，右边全为1，所以翻转次数为 i 左边1的个数加上 i 右边0的个数，最后求出最小值。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    int key0[100005], key1[100005];

    int minFlipsMonoIncr(string s) {
        int cnt0 = 0;
        int index = 0;
        for (auto &x : s) {
            key0[index + 1] += key0[index], key1[index + 1] += key1[index];
            if (x == '0') {
                cnt0++;
                key0[index + 1]++;
            } else {
                key1[index + 1]++;
            }
            index++;
        }
        int res = INT_MAX;
        for (int i = 0; i <= s.size(); i++) {
            res = min(res, key1[i] + cnt0 - key0[i]);
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
