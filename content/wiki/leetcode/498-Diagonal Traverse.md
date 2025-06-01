---
title: 498-Diagonal Traverse
date: 2022-06-14 10:50:39
updated: 2022-06-14 10:58:47
tags: 
top: false
mathjax: true
categories: 
author: booiris
layout: wiki
topic: leetcode
order: 498
---

## 题意

按对角线遍历数组。

![](https://cdn.jsdelivr.net/gh/booiris-cdn/img/498-Diagonal_Traverse.png)

## 题解

只有两种方向，一种斜向上 x-1,y+1；一种斜向下 x+1,y-1。对于拐角处，有几种情况。

1. 在对角处改变方向，这时需要根据在左下角还是右上角的情况做出不同处理。
2. 在左边和上面改变方向，左边对应 y 小于 0 ，上面对应 x 小于 0 ，这时只需要将 x 或 y重置为0，然后改变方向。
3. 在右边和下面改变方向，右边对应 y 等于 m ，下边对应 x 等于 n，这是除了将 y 改变为 m-1 ，或将 x 改变为 n-1 ，还需要将对应 x 加 2或者 y 加 2。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    vector<int> findDiagonalOrder(vector<vector<int>> &mat) {
        int n = mat.size();
        int m = mat[0].size();
        vector<int> res;
        int dir = 1;
        int nowx = 0, nowy = 0;
        for (int i = 0; i < m * n; i++) {
            res.push_back(mat[nowx][nowy]);
            nowx -= dir, nowy += dir;
            if (nowx < 0 && nowy >= m) {
                nowx = 1;
                nowy = m - 1;
                dir = -1;
            } else if (nowx >= n && nowy < 0) {
                nowx = n - 1;
                nowy = 1;
                dir = 1;
            } else if (nowx < 0) {
                nowx = 0;
                dir = -1;
            } else if (nowx >= n) {
                nowx = n - 1;
                nowy += 2;
                dir = 1;
            } else if (nowy < 0) {
                nowy = 0;
                dir = 1;
            } else if (nowy >= m) {
                nowy = m - 1;
                nowx += 2;
                dir = -1;
            }
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
