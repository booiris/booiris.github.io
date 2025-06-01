---
title: 933-Number of Recent Calls
date: 2022-05-06 15:52:34
updated: 2022-06-10 00:41:48
tags: 
top: false
mathjax: true
author: booiris
layout: wiki
topic: leetcode
order: 933
---

## 题意

流式输入时间戳为 t 的请求，对于每一次输入，返回 [t-3000,t] 内请求的个数。

## 题解

使用队列维护，将小于 t-3000 的数出队，再将 t 入队，返回当前队列元素个数。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class RecentCounter {
  public:
    queue<int> q;
    RecentCounter() {
    }

    int ping(int t) {
        int low = t - 3000;
        while (!q.empty() && low > q.front()) {
            q.pop();
        }
        q.push(t);
        return q.size();
    }
};

/**
 * Your RecentCounter object will be instantiated and called as such:
 * RecentCounter* obj = new RecentCounter();
 * int param_1 = obj->ping(t);
 */
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
