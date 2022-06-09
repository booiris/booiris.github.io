---
title: 497-Random Point in Non-overlapping Rectangles 
date: 2022-06-10 00:24:37 
updated: 2022-06-10 00:38:54
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order: 497 
---

## 题意

给出多个在平面上且不相交的多个长方形，要求等概率从这些长方形范围内选出一个点（包含长方形的边），返回点的二维坐标。

## 题解

题目中的长方形数量小于100，每个长方形长和宽的长度不大于2000，所以每个长方形最多有 $2000\times2000=4e6$ 个点，总共最多 $4e6\times 100 = 4e8$ 个点。所以首先为每个点编号，然后等概率选取一个点，根据点的编号判断该点在哪个长方形中，然后根据点的编号与长方形左下角点编号的差距计算偏移，然后求出选取点的坐标。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    vector<int> key;
    int maxn = 0;
    vector<vector<int>> rect;

    Solution(vector<vector<int>> &rects) : rect(rects) {
        for (auto &x : rects) {
            key.push_back(maxn); //Give points numbers
            maxn += (x[2] - x[0] + 1) * (x[3] - x[1] + 1);
        }
    }

    vector<int> pick() {
        int now = rand() % maxn;
        int index = 0;
        while (index < key.size() && key[index] <= now)
            index++;
        index--; // get which rectangle the point is in
        now -= key[index]; // calculate offset
        int len = rect[index][3] - rect[index][1] + 1;
        return {rect[index][0] + now / len, rect[index][1] + now % len};
    }
};

/**
 * Your Solution object will be instantiated and called as such:
 * Solution* obj = new Solution(rects);
 * vector<int> param_1 = obj->pick();
 */
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
