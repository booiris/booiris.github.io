---
title: 890-Find and Replace Pattern 
date: 2022-06-12 15:32:39 
updated: 2022-06-12 15:34:01
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:  890    # add order, base on problem number.
---

## 题意

## 题解

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;

class Solution {
  public:
    vector<string> findAndReplacePattern(vector<string> &words, string pattern) {
        int key[30];
        bool vis[30];
        vector<string> res;
        for (auto &x : words) {
            if (x.size() != pattern.size())
                continue;
            memset(key, 0, sizeof key);
            memset(vis, 0, sizeof vis);
            bool flag = 1;
            for (int i = 0; i < pattern.size(); i++) {
                if (key[pattern[i] - 'a'] == 0) {
                    if (vis[x[i] - 'a']) {
                        flag = 0;
                        break;
                    }
                    vis[x[i] - 'a'] = 1;
                    key[pattern[i] - 'a'] = x[i];
                }
                if (key[pattern[i] - 'a'] != x[i]) {
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                res.push_back(x);
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
